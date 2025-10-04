import { cn } from "@/lib/utils";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-nasm"; // Import the NASM language component
import "prismjs/themes/prism.css"; // Import the Prism.js default theme CSS
import React, { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import { Button } from "../components/ui/button";
import FontAdjust from "./font-adjust";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CodeEditor: React.FC = ({ }) => {
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

  const highlightCode = (code: string) =>
    highlight(code, languages.nasm, "nasm");

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
    <div className="relative p-4 border rounded-lg shadow-sm">
      <FontAdjust currentFontSize={fontSize} setFont={setFontSize} />
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={highlightCode}
        padding={10}
        textareaClassName="focus:outline-none"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: fontSize,
          minHeight: "500px",
          overflow: "auto",
          borderRadius: "0.5rem",
          border: "1px solid hsl(240 5% 64.9%)",
        }}
      />
      <Button
        onClick={handleSendCode}
        disabled={!code.trim() || loading}
        className="mt-4 w-full"
      >
        {loading ? "Sending..." : "Send to API"}
      </Button>
      <div className="flex gap-2 my-4">
        <Label>Input:</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
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
      {(outputArr.length || stdError) && (
        <div
          className={cn(
            "mt-4 p-3 bg-secondary border-[1px] rounded-md overflow-auto text-sm",
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
  );
};

export default CodeEditor;
