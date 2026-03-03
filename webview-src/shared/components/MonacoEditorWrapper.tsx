import Editor from "@monaco-editor/react";
import type { EditorProps } from "@monaco-editor/react";
import { useTheme } from "@/shared/hooks/useTheme";
import { setActiveMonacoEditor } from "@/shared/lib/monaco-store";
import type { editor } from "monaco-editor";
import { useRef, useEffect } from "react";

interface MonacoEditorWrapperProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language: "json" | "typescript" | "xml" | "plaintext" | "css" | "html" | "javascript";
  readOnly?: boolean;
}

export function MonacoEditorWrapper({
  value,
  onChange,
  language,
  readOnly = false,
}: MonacoEditorWrapperProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    return () => {
      // Clear global reference if this editor was the active one
      setActiveMonacoEditor(null);
    };
  }, []);

  const handleMount = (ed: editor.IStandaloneCodeEditor) => {
    editorRef.current = ed;
    ed.onDidFocusEditorText(() => setActiveMonacoEditor(ed));
    ed.onDidBlurEditorText(() => setActiveMonacoEditor(null));
  };

  const options: EditorProps["options"] = {
    readOnly,
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "var(--font-mono)",
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    padding: { top: 16 },
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={options}
          onMount={handleMount}
          loading={<div className="p-4 text-text-secondary">Loading editor...</div>}
        />
      </div>
    </div>
  );
}
