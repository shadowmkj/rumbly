import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-nasm'; // Import the NASM language component
import 'prismjs/themes/prism.css'; // Import the Prism.js default theme CSS

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState('');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const highlightCode = (code: string) => highlight(code, languages.nasm, 'nasm');

  const handleSendCode = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const response = await fetch('http://localhost:3000/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code
        }),
      });
      const data = await response.json();
      setApiResponse(JSON.stringify(data));
    } catch (error) {
      setApiResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 border rounded-lg shadow-sm">
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={highlightCode}
        padding={10}
        textareaClassName="focus:outline-none"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: '#f5f2f0',
          minHeight: '200px',
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

      {apiResponse && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md overflow-auto text-sm">
          <h3 className="font-semibold mb-2">API Response:</h3>
          <pre className="whitespace-pre-wrap break-all">{apiResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
