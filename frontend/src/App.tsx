import { useEffect, useRef, useState } from 'react';
import CodeEditor from './components/CodeEditor';
import { ThemeToggle } from './components/theme-toggle';

function App() {
  const [outputArr, setOutputArr] = useState<string[]>([]);
  const websocket = useRef<WebSocket | null>(null);

  const connect = () => {
    websocket.current = new WebSocket('ws://localhost:3000');

    websocket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.current.onmessage = (event) => {
      setOutputArr((prev) => [...prev, event.data]);
    };

    websocket.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Optional: implement reconnection logic here
      setTimeout(connect, 1000); // Try to reconnect every second
    };

    websocket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
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
      console.error('WebSocket is not connected.');
    }
  };

  const clearOutput = () => {
    setOutputArr([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6">Rumbly</h1>
        <div className='flex items-center justify-end mb-6'>
          <ThemeToggle />
        </div>
        <CodeEditor sendCode={sendCode} outputArr={outputArr} clearOutput={clearOutput} />
      </div>
    </div>
  );
}

export default App;
