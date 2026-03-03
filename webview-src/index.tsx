import "./i18n";
import "./index.css";
import { createRoot } from "react-dom/client";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { App } from "./App";

// Monaco Editor: use bundled version, disable CDN
(window as Record<string, unknown>).MonacoEnvironment = {
  getWorker(_id: string, _label: string) {
    return new Worker(
      URL.createObjectURL(
        new Blob(["self.onmessage=function(){}"], { type: "text/javascript" })
      )
    );
  },
};
loader.config({ monaco });

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
