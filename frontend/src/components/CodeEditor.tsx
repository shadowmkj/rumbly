import { cn } from '@/lib/utils';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-nasm'; // Import the NASM language component
import 'prismjs/themes/prism.css'; // Import the Prism.js default theme CSS
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { Button } from '../components/ui/button';
import FontAdjust from './font-adjust';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CodeEditorProps {
  sendCode: (code: string) => void;
  outputArr: string[];
  clearOutput: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ sendCode, outputArr, clearOutput }) => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState("")
  const [stdError, setStdError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState(16)

  const highlightCode = (code: string) => highlight(code, languages.nasm, 'nasm');

  const handleSendCode = async () => {
    setLoading(true);
    setStdError(null);
    sendCode(code);
    setLoading(false);
  }

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
          minHeight: '500px',
          overflow: 'auto',
          borderRadius: '0.5rem',
          border: '1px solid hsl(240 5% 64.9%)',
        }}
      />
      <Button
        onClick={handleSendCode}
        disabled={!code.trim() || loading}
        className="mt-4 w-full"
      >
        {loading ? 'Sending...' : 'Send to API'}
      </Button>
      <div className='flex gap-2 my-4'>
        <Label>Input:</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button variant={'outline'} onClick={handleSendCode} disabled={!input.trim() || loading}>Send</Button>
        <Button variant={'secondary'} onClick={clearOutput}>Clear</Button>
      </div>
      {
        (outputArr.length || stdError) && (
          <div className={cn("mt-4 p-3 bg-secondary border-[1px] rounded-md overflow-auto text-sm", { "border-destructive": stdError })}>
            {outputArr.map((out, index) => <pre key={index} className="whitespace-pre-wrap break-all">{out}</pre>
            )}
            {stdError &&
              <pre className="whitespace-pre-wrap break-all">{stdError}</pre>}
          </div>
        )
      }
    </div >
  );
};

export default CodeEditor;
