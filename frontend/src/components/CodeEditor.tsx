import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-nasm'; // Import the NASM language component
import 'prismjs/themes/prism.css'; // Import the Prism.js default theme CSS
import 'prismjs/themes/prism.css'; // A dark theme that works well in dark mode
import FontAdjust from './font-adjust';
import { cn } from '@/lib/utils';


const CodeEditor: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [stdError, setStdError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState(16)

  const highlightCode = (code: string) => highlight(code, languages.nasm, 'nasm');

  const handleSendCode = async () => {
    setLoading(true);
    setOutput(null);
    setStdError(null);
    try {
      const response = await fetch('https://api.codenik.in/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code
        }),
      });
      const data = await response.json();
      setOutput(data.output);
      if (data.errors.length > 0) {
        setStdError(data.errors)
      }
    } catch (error) {
      setStdError(`${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
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

      {(output || stdError) && (
        <div className={cn("mt-4 p-3 bg-secondary border-[1px] rounded-md overflow-auto text-sm", { "border-destructive": stdError })}>
          <pre className="whitespace-pre-wrap break-all">{output}</pre>
          {stdError &&
            <pre className="whitespace-pre-wrap break-all">{stdError}</pre>}
        </div>
      )
      }
    </div >
  );
};

export default CodeEditor;
