import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { useTheme } from "./theme-provider";
import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  fontSize: number;
  height?: string | number;
  onRun?: () => void;
};

const MonacoEditor = ({ value, onChange, fontSize, height = 500 }: Props) => {
  const { theme } = useTheme();

  const monacoRef = useRef<any | null>(null);

  const toHex = (color: string, fallback: string) => {
    if (!color) return fallback;
    if (color.startsWith("#")) return color;
    const m = color.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
      const r = Number(m[1]).toString(16).padStart(2, "0");
      const g = Number(m[2]).toString(16).padStart(2, "0");
      const b = Number(m[3]).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    return fallback;
  };

  const applyTailwindTheme = () => {
    const monaco = monacoRef.current;
    if (!monaco) return;

    const isDark = document.documentElement.classList.contains("dark");
    const themeName = isDark ? "tailwind-dark" : "tailwind-light";
    const base = isDark ? "vs-dark" : "vs";
    const computedBg = getComputedStyle(document.body).backgroundColor;
    const bg = toHex(computedBg, isDark ? "#1e1e1e" : "#ffffff");

    monaco.editor.defineTheme(themeName, {
      base: base as any,
      inherit: true,
      rules: [],
      colors: {
        "editor.background": bg,
        "editorGutter.background": bg,
      },
    });
    monaco.editor.setTheme(themeName);
  };

  const onMount: OnMount = (_editor, monaco) => {
    monacoRef.current = monaco;

    monaco.languages.register({ id: "nasm" });
    monaco.languages.setMonarchTokensProvider("nasm", {
      ignoreCase: true,
      tokenPostfix: ".asm",
      brackets: [
        { open: "[", close: "]", token: "delimiter.bracket" },
        { open: "(", close: ")", token: "delimiter.parenthesis" },
      ],
      keywords: [
        "mov","add","sub","mul","imul","div","idiv","and","or","xor","not","shl","shr","sal","sar","inc","dec",
        "push","pop","pushf","popf","call","ret","jmp","je","jne","jg","jge","jl","jle","ja","jae","jb","jbe",
        "jz","jnz","loop","loope","loopne","cmp","test","lea","nop","xchg","xadd","bswap",
        "cmovz","cmovnz","cmova","cmovae","cmovb","cmovbe","seta","setae","setb","setbe","setz","setnz",
        "bt","bts","btr","btc","clc","stc","cli","sti","cld","std","int","syscall","sysret","cpuid"
      ],
      directives: [
        "global","extern","section","segment","bits","org","equ","align",
        "db","dw","dd","dq","dt","resb","resw","resd","resq","rest","times",
        "macro","endmacro","struc","endstruc"
      ],
      tokenizer: {
        root: [
          { include: "@whitespace" },
          [/;.*$/, "comment"],
          // Preprocessor-style directives starting with '%'
          [/%[a-zA-Z_][\w]*/, "keyword"],
          // Labels (e.g., start:, .L1:)
          [/[A-Za-z_.$][\w.$]*\s*:/, "type.identifier"],
          // Registers (x86/x64 + XMM/YMM/ZMM, and common ones)
          [/\b(?:r(?:1[0-5]|[0-9])|e?[abcd]x|e?[sd]i|e?[sb]p|[abcd][hl]|xmm(?:1[0-5]|[0-9])|ymm(?:[12]?[0-9]|3[01])|zmm(?:[12]?[0-9]|3[01])|cr[0-8]|dr[0-7])\b/, "variable.predefined"],
          // Size specifiers
          [/\b(?:byte|word|dword|qword|tword|oword|yword|zword)\b/, "type"],
          // Numbers
          [/\b0x[0-9a-fA-F]+\b/, "number.hex"],
          [/\b[0-9A-F]+h\b/, "number.hex"],
          [/\b[01]+b\b/, "number.binary"],
          [/\b[0-7]+o\b/, "number.octal"],
          [/\b-?\d+\b/, "number"],
          // Strings and character constants
          [/'([^'\\]|\\.)'/, "string"],
          [/"([^"\\]|\\.)*"/, "string"],
          // Identifiers/instructions/directives
          [/[A-Za-z_.$][\w.$]*/, { cases: { "@keywords": "keyword", "@directives": "keyword", "@default": "identifier" } }],
          // Delimiters & operators
          [/[,.:\[\]()]/, "delimiter"],
          [/[-+*/%]/, "operator"],
        ],
        whitespace: [
          [/\s+/, "white"],
        ],
      },
    });

    monaco.languages.setLanguageConfiguration("nasm", {
      comments: { lineComment: ";" },
      brackets: [["[", "]"], ["(", ")"]],
    });

    applyTailwindTheme();
  };

  useEffect(() => {
    // Defer until DOM classes/styles updated
    const id = requestAnimationFrame(applyTailwindTheme);
    return () => cancelAnimationFrame(id);
  }, [theme]);

  return (
    <Editor
      value={value}
      onChange={(v) => onChange(v ?? "")}
      language="nasm"
      height={typeof height === "number" ? `${height}px` : height}
      options={{
        lineNumbers: "on",
        fontSize,
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        dragAndDrop: false,
        mouseWheelZoom: false,
      }}
      onMount={onMount}
    />
  );
};

export default MonacoEditor;
