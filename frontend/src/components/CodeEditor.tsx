import { cn } from "@/lib/utils";
// Monaco replaces Prism for syntax highlighting; using MonacoEditor wrapper
import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import { Button } from "../components/ui/button";
import FontAdjust from "./font-adjust";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CodeEditor: React.FC = () => {
  const [outputArr, setOutputArr] = useState<string[]>([]);
  const websocket = useRef<WebSocket | null>(null);

  const connect = () => {
    websocket.current = new WebSocket("wss://api.codenik.in");

    websocket.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.current.onmessage = (event) => {
      setOutputArr((prev) => [...prev, event.data]);
    };

    websocket.current.onclose = () => {
      console.log("WebSocket disconnected");
      // Optional: implement reconnection logic here
      setTimeout(connect, 1000); // Try to reconnect every second
    };

    websocket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
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
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(code);
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const clearOutput = () => {
    setOutputArr([]);
  };

  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [stdError, setStdError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState(16);



  const handleSendCode = async () => {
    setLoading(true);
    setStdError(null);
    sendCode(code);
    setLoading(false);
  };

  const handleSendMessage = async () => {
    setLoading(true);
    setStdError(null);
    setOutputArr((prev) => [
      ...prev.slice(0, -1),
      prev[prev.length - 1] + input,
    ]);
    sendCode(input);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="h-[80vh] flex flex-col md:flex-row gap-4">
      {/* Left Pane: Editor */}
      <div className="md:w-3/5 w-full border rounded pr-3 pt-3 pl-0 min-h-0 mb-18">
        <FontAdjust currentFontSize={fontSize} setFont={setFontSize} />
        <MonacoEditor
          value={code}
          onChange={setCode}
          fontSize={fontSize}
          height="100%"
        />
      </div>
      {/* Right Pane: Controls and Output */}
      <div className="md:w-2/5 w-full flex flex-col gap-3 min-h-0">
        {/* Controls Row */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSendCode}
            disabled={!code.trim() || loading}
            className="flex-1"
          >
            {loading ? "Sending..." : "Run 🚀"}
          </Button>
        </div>
        {/* Input Row */}
        <div className="flex gap-2">
          <Label>Input:</Label>
          <Input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
          <Button
            variant={"outline"}
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
          >
            Send
          </Button>
          <Button variant={"secondary"} onClick={clearOutput}>
            Clear
          </Button>
        </div>
        {/* Output Area */}
        {(outputArr.length || stdError) && (
          <div
            className={cn(
              "flex-1 overflow-auto p-3 bg-secondary border-[1px] rounded-md text-sm",
              { "border-destructive": stdError }
            )}
          >
            {outputArr.map((out, index) => (
              <pre key={index} className="whitespace-pre-wrap break-all">
                {out}
              </pre>
            ))}
            {stdError && (
              <pre className="whitespace-pre-wrap break-all">{stdError}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
