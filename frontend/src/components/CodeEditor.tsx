import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import { Button } from "../components/ui/button";
import FontAdjust from "./font-adjust";
import { Textarea } from "./ui/textarea";

const CodeEditor: React.FC = () => {
    const websocket = useRef<WebSocket | null>(null);

    const connect = () => {
        websocket.current = new WebSocket("wss://api.codenik.in");

        websocket.current.onopen = () => {
            console.log("WebSocket connected");
        };

        websocket.current.onmessage = (event) => {
            setOutput((prev) => prev + event.data);
            console.log(event.data.length);
            setOpLength((prev) => prev + event.data.length);
        };

        websocket.current.onclose = () => {
            console.log("WebSocket disconnected");
            setInput("");
            setCodeSent(false);
            if (websocket.current?.readyState !== WebSocket.OPEN) {
                setTimeout(connect, 1000); // Reconnect after 1 second
            }
        };

        websocket.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            setInput("");
            setCodeSent(false);
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
            if (!codeSent) localStorage.setItem("lastCode", code);
            setCodeSent(true);
        } else {
            console.error("WebSocket is not connected.");
        }
    };

    const clearOutput = () => {
        setCodeSent(false);
        setOutput("");
        setInput("");
        setOpLength(0);
        window.location.reload();
    };

    const [output, setOutput] = useState("");
    const [code, setCode] = useState(localStorage.getItem("lastCode") || "");
    const [opLength, setOpLength] = useState(0); // equals output.length
    const [codeSent, setCodeSent] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState(16);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Prevent editing the frozen output portion
        if (e.target.value.length < opLength) {
            return;
        }
        const nextInput = e.target.value.slice(opLength);
        setInput(nextInput);
    };

    const handleSendCode = async () => {
        setLoading(true);
        if (opLength > 0) {
            setOutput("");
            setInput("");
            setOpLength(0);
        }
        sendCode(code);
        setLoading(false);
        textAreaRef.current?.focus();
    };

    const handleSendMessage = async () => {
        setLoading(true);
        sendCode(input);
        setOutput((prev) => prev + input + "\n");
        setOpLength((prev) => prev + input.length + 1);
        setInput("");
        setLoading(false);
    };

    return (
        <div className="h-[80vh] flex flex-col md:flex-row gap-4">
            {/* <div className="flex flex-col"> */}
            {/*     <span>Input: {input}</span> */}
            {/*     <span>Length:{opLength}</span> */}
            {/* </div> */}
            {/* Left Pane: Editor */}
            <div className="h-3/4 md:h-auto md:w-3/5 w-full border rounded pr-3 pt-3 pl-0 min-h-0">
                <div className="flex items-center justify-between mb-2">
                    <Button variant={"secondary"} onClick={() => setCode("")}>
                        Clear
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
                <Button variant={"secondary"} onClick={clearOutput}>
                    Clear
                </Button>
                <Textarea
                    className="h-full"
                    ref={textAreaRef}
                    onKeyDown={handleTextAreaKeyDown}
                    value={output + input}
                    onChange={handleTextChange}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
