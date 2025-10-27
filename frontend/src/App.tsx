import CodeEditor from "./components/CodeEditor";
import { ThemeToggle } from "./components/theme-toggle";

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-center mb-6">Rumbly</h1>
        <div className="flex items-center justify-end mb-6">
          <ThemeToggle />
        </div>
        <CodeEditor />
      </div>
    </div>
  );
}

export default App;
