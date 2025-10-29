import React from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface TerminalProps {
    output: string;
    input: string;
    handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleTextAreaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    textAreaRef: React.RefObject<HTMLTextAreaElement>;
    handleSendMessage: () => Promise<void>;
    loading: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ output, input, handleTextChange, handleTextAreaKeyDown, textAreaRef, handleSendMessage, loading }) => {
    console.log("Terminal output:", output);
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-2 bg-black text-white">
                <pre>{output}</pre>
            </div>
            <div className="relative">
                <Textarea
                    className="h-auto pr-12"
                    ref={textAreaRef}
                    onKeyDown={handleTextAreaKeyDown}
                    value={input}
                    onChange={handleTextChange}
                    disabled={!loading}
                />
                <Button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0"
                    onClick={handleSendMessage}
                    disabled={!loading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default Terminal;
