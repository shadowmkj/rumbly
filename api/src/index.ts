import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import http from 'http'
import path from 'path';
import fs from 'fs'
import os from 'os';
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import { RawData, WebSocket, WebSocketServer } from 'ws';
const app: Express = express();
const port = process.env.PORT || 3000;
const server: http.Server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({ origin: '*' }));
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: true,
    message: "Server is online! 😘"
  })
});

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  let hasReceivedCode = false;
  let childProcess: ChildProcessWithoutNullStreams | null = null;
  let tempDir: string | null = null;

  ws.on('message', (message: RawData) => {
    if (!hasReceivedCode) {
      hasReceivedCode = true;
      const code = message.toString();

      try {
        tempDir = path.join(__dirname, '..', 'nasm')
        const asmPath = path.join(tempDir, 'main.asm');
        fs.writeFileSync(asmPath, code);
        const dockerCommand = 'docker';
        const dockerArgs = [
          'run',
          '--rm',                     // Automatically remove the container when it exits
          '-i',                       // Crucial for interactivity: keeps STDIN open
          '--network=none',           // Disable networking for security
          `--memory=128m`,            // Set a 128MB memory limit
          `--cpus=0.5`,               // Limit to half a CPU core
          `-v`, `${tempDir}:/app`,    // Mount the temp directory into the container
          'rumbly-runner',            // The image to use
          'sh', '-c', 'nasm -f elf64 main.asm -o main.o && ld -m elf_x86_64 main.o -o main && ./main'
        ];

        childProcess = spawn(dockerCommand, dockerArgs);

        childProcess.stdout.on('data', (data: Buffer) => {
          ws.send(data.toString());
        });

        childProcess.stderr.on('data', (data: Buffer) => {
          ws.send(`[CONTAINER STDERR]: ${data.toString()}`);
          // ws.close()
        });

        childProcess.on('close', (code: number | null) => {
          ws.send(`\n[Program exited with code ${code ?? 'unknown'}]`);
          ws.close();
        });

      } catch (err: any) {
        ws.send(`Server Error: ${err.message}`);
        ws.close();
      }
    } else {
      if (childProcess && childProcess.stdin) {
        childProcess.stdin.write(message.toString() + '\n');
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (childProcess) {
      childProcess.kill();
    }
    if (tempDir) {
      // fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  ws.on('error', (err: Error) => {
    console.error('WebSocket error:', err);
  });
});
app.post('/run', async (req, res) => {
  const uuid = randomUUID();
  try {
    const data = req.body;
    const filePath = path.join(__dirname, '..', `${uuid}.asm`);

    fs.writeFile(filePath, data.code, (err) => {
      if (err) {
        console.error('Failed to save data:', err);
        return res.status(500).send('Error saving data.');
      }
    });

    const dockerCommand = `docker run --rm -v ./:/app --memory=100m --cpus=0.5 --name rumbly-runner-${uuid} rumbly-runner:latest sh -c "nasm -f elf64 -o ${uuid}.o ${uuid}.asm && ld -o ${uuid} ${uuid}.o && ./${uuid}"`;


    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({
          errors: stderr
        })
      }
      res.status(200).json({
        output: stdout,
        errors: stderr
      });
    });
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('Internal Server Error: Could not write data to file.');
  }
})



server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
