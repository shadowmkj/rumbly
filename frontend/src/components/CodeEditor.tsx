import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import { Button } from "../components/ui/button";
import FontAdjust from "./font-adjust";
import Terminal from "./Terminal";

const CodeEditor: React.FC = () => {
  const websocket = useRef<WebSocket | null>(null);

  const connect = () => {
    websocket.current = new WebSocket("wss://api.codenik.in");

    websocket.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.current.onmessage = (event) => {
      console.log("Received message from WebSocket:", event.data);
      setOutput((prev) => prev + event.data);
    };

    websocket.current.onclose = () => {
      console.log("WebSocket disconnected");
      setInput("");

                  setLoading(false);

                  if (websocket.current?.readyState !== WebSocket.OPEN) {

                      setTimeout(connect, 1000); // Reconnect after 1 second

                  }

              };

    websocket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setInput("");
      setLoading(false);
      websocket.current?.close();
    };
  };

  useEffect(() => {
    connect();
    return () => {
      websocket.current?.close();
    };
  }, []);

      const sendCode = (code: string) => {
          console.log("WebSocket readyState:", websocket.current?.readyState);
          if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
              websocket.current.send(code);
          } else {      console.error("WebSocket is not connected.");
    }
  };

  const clearOutput = () => {
    console.log("clearOutput called");
    setOutput("");
    setInput("");
  };

  const [output, setOutput] = useState("");
  const [code, setCode] = useState(localStorage.getItem("lastCode") || "");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState(16);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSendCode = async () => {
    setLoading(true);

    setOutput("");

    setInput("");

    
    sendCode(code);

    localStorage.setItem("lastCode", code);

                            console.log("Attempting to focus textArea. Current ref:", textAreaRef.current);

                            setTimeout(() => {

                                textAreaRef.current?.focus();

                            }, 0);  };

      const handleSendMessage = async () => {
          sendCode(input);
          setOutput((prev) => prev + input + "\n");
          setInput("");
      };
          const handleStopCode = () => {

              clearOutput();

              setLoading(false);

              websocket.current?.close();

          };

  return (
    <div className="h-[80vh] flex flex-col md:flex-row gap-4">
      {/* Left Pane: Editor */}
      <div className="h-3/4 md:h-auto md:w-3/5 w-full border rounded pr-3 pt-3 pl-0 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <Button variant={"secondary"} onClick={() => setCode("")}>
            Clear Code
          </Button>
          <FontAdjust currentFontSize={fontSize} setFont={setFontSize} />
        </div>
        <MonacoEditor
          value={code}
          onChange={setCode}
          fontSize={fontSize}
          height="calc(100% - 40px)"
        />
      </div>
            {/* Right Pane: Controls and Output */}
            <div className="h-1/4 md:h-auto md:w-2/5 w-full flex flex-col gap-3 min-h-0">
              <Terminal
                output={output}
                input={input}
                handleTextChange={handleTextChange}
                handleTextAreaKeyDown={handleTextAreaKeyDown}
                textAreaRef={textAreaRef}
                handleSendMessage={handleSendMessage}
                loading={loading}
              />
              {/* Controls Row */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSendCode}
                  disabled={!code.trim() || loading}
                  className="flex-1"
                >
                  {loading ? "Running..." : "Run 🚀"}
                </Button>
              </div>
              {/* Input Row */}
              <Button
                variant={"secondary"}
                onClick={loading ? handleStopCode : clearOutput}
              >
                {loading ? "Stop" : "Clear Out"}
              </Button>
            </div>
    </div>
  );
};

export default CodeEditor;
