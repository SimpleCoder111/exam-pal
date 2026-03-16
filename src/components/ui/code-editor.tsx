import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
}

const getLanguageExtension = (lang: string) => {
  switch (lang.toLowerCase()) {
    case "javascript":
    case "js":
      return javascript();
    case "typescript":
    case "ts":
      return javascript({ typescript: true });
    case "python":
    case "py":
      return python();
    case "java":
      return java();
    case "c":
    case "cpp":
    case "c++":
      return cpp();
    default:
      return javascript();
  }
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "javascript",
  placeholder = "// Write your code here...",
  minHeight = "150px",
  readOnly = false,
}) => {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(() => [getLanguageExtension(language)], [language]);

  return (
    <div className="rounded-xl border-2 border-border overflow-hidden">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        placeholder={placeholder}
        readOnly={readOnly}
        minHeight={minHeight}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          autocompletion: true,
          bracketMatching: true,
          indentOnInput: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
