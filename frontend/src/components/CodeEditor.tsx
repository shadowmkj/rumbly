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
            setText((prev) => prev + event.data);
            console.log(event.data.length);
            setOpLength((prev) => prev + event.data.length);
            setInput(text.slice(opLength));
        }

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
        setText("")
        setInput("");
        setOpLength(0);
        window.location.reload();
    };
    const [text, setText] = useState("");
    const [code, setCode] = useState(localStorage.getItem("lastCode") || "");
    const [opLength, setOpLength] = useState(0);
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
    }
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= opLength) {
            return;
        }
        setText(e.target.value);
        setInput(e.target.value.slice(opLength));
    }

    const handleSendCode = async () => {
        setLoading(true);
        if (opLength > 0) {
            setText("")
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
                <Button variant={"secondary"} onClick={clearOutput}>
                    Clear
                </Button>
                <Textarea className="min-h-[500px]" ref={textAreaRef} onKeyDown={handleTextAreaKeyDown} value={text} onChange={handleTextChange} />
            </div>
        </div>
    );
};

export default CodeEditor;
