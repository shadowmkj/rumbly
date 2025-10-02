import CodeEditor from './components/CodeEditor';
import './App.css';

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">NASM Code Editor</h1>
        <CodeEditor />
      </div>
    </div>
  );
}

export default App;
