use futures_util::{SinkExt, StreamExt};
use std::fs;
use std::process::Stdio;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::process::Command;
use uuid::Uuid;
use warp::ws::{Message, WebSocket};
use warp::Filter;

#[tokio::main]
async fn main() {
    let ws_route = warp::path("ws")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| ws.on_upgrade(handle_connection));

    println!("Server starting on 127.0.0.1:8080");
    warp::serve(ws_route).run(([127, 0, 0, 1], 8080)).await;
}
async fn handle_connection(ws: WebSocket) {
    println!("Client connected");
    let (mut ws_tx, mut ws_rx) = ws.split();

    let code = match ws_rx.next().await {
        Some(Ok(msg)) if msg.is_text() => {
            if let Ok(s) = msg.to_str() {
                s.to_owned()
            } else {
                return;
            }
        }
        _ => return,
    };
    let session_id = Uuid::new_v4().to_string();
    let session_dir = format!("./runs/{}", session_id);
    if fs::create_dir_all(&session_dir).is_err() {
        let _ = ws_tx
            .send(Message::text("Error: Could not create session directory."))
            .await;
        return;
    }
    let absolute_session_dir = match fs::canonicalize(&session_dir) {
        Ok(path) => path,
        Err(_) => {
            let _ = ws_tx
                .send(Message::text(
                    "Error: Could not find session directory path.",
                ))
                .await;
            return;
        }
    };
    let asm_path = absolute_session_dir.join("main.asm");
    if tokio::fs::write(&asm_path, &code).await.is_err() {
        let _ = ws_tx
            .send(Message::text("Error: Could not write to assembly file."))
            .await;
        return;
    }
    let mut cmd = Command::new("docker");
    let absolute_path_str = match absolute_session_dir.to_str() {
        Some(s) => s,
        None => {
            let _ = ws_tx
                .send(Message::text("Error: Session path is not valid UTF-8."))
                .await;
            return;
        }
    };
    cmd.args([
        "run",
        "--rm",
        "-i",
        "--network=none",
        "--memory=64m",
        "--cpus=0.1",
        "-v",
        &format!("{}:/app", absolute_path_str), // Use absolute path
        "rumbly-runner",
        "sh",
        "-c",
        "nasm -f elf64 main.asm -o main.o && ld main.o -o main && ./main",
    ]);

    cmd.stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let mut child = match cmd.spawn() {
        Ok(child) => child,
        Err(_) => {
            let _ = ws_tx
                .send(Message::text("Error: Failed to spawn docker command."))
                .await;
            return;
        }
    };

    let mut child_stdin = child.stdin.take().unwrap();
    let mut child_stdout = child.stdout.take().unwrap();
    let mut child_stderr = child.stderr.take().unwrap();

    // Task to forward client input to container stdin
    let input_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = ws_rx.next().await {
            if msg.is_text() {
                if child_stdin.write_all(msg.as_bytes()).await.is_err() {
                    break;
                }
            }
        }
    });

    // Task to forward container output (stdout & stderr) to the user
    let output_task = tokio::spawn(async move {
        let mut stdout_buf = [0u8; 1024];
        let mut stderr_buf = [0u8; 1024];

        loop {
            tokio::select! {
                // Read from stdout
                Ok(n) = child_stdout.read(&mut stdout_buf) => {
                    if n == 0 { break; } // EOF
                    let s = String::from_utf8_lossy(&stdout_buf[..n]);
                    if ws_tx.send(Message::text(s)).await.is_err() {
                        break;
                    }
                },
                // Read from stderr
                Ok(n) = child_stderr.read(&mut stderr_buf) => {
                    if n == 0 { break; } // EOF
                    let s = String::from_utf8_lossy(&stderr_buf[..n]);
                    if ws_tx.send(Message::text(format!("[STDERR] {}", s))).await.is_err() {
                        break;
                    }
                },
                else => break,
            }
        }
    });

    let _ = tokio::try_join!(
        async { child.wait().await.map_err(|e| e.to_string()) },
        async { input_task.await.map_err(|e| e.to_string()) },
        async { output_task.await.map_err(|e| e.to_string()) }
    );

    println!("Client disconnected, session ended.");
}
