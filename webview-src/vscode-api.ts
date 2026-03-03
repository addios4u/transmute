interface VsCodeApi {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

const vscode: VsCodeApi =
  typeof acquireVsCodeApi === 'function'
    ? acquireVsCodeApi()
    : {
        postMessage: (msg: unknown) => console.log('[mock] postMessage:', msg),
        getState: () => undefined,
        setState: (state: unknown) => console.log('[mock] setState:', state),
      };

export function postMessage(message: unknown): void {
  vscode.postMessage(message);
}

export function getState<T>(): T | undefined {
  return vscode.getState() as T | undefined;
}

export function setState<T>(state: T): void {
  vscode.setState(state);
}

export function copyToClipboard(text: string): void {
  vscode.postMessage({ type: 'clipboard:write', text });
}

// --- File dialog via extension host ---

interface FileDialogFile {
  name: string;
  data: string; // base64
  mimeType: string;
}

type FileDialogCallback = (files: File[]) => void;

let pendingFileDialogCallback: FileDialogCallback | null = null;

export function openFileDialog(
  filters: Record<string, string[]>,
  multiple: boolean,
): Promise<File[]> {
  return new Promise((resolve) => {
    pendingFileDialogCallback = resolve;
    vscode.postMessage({ type: 'openFileDialog', filters, multiple });
  });
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

// --- Monaco clipboard integration ---
import {
  isMonacoFocused,
  getMonacoSelectedText,
  insertTextInMonaco,
  selectAllInMonaco,
  deleteSelectionInMonaco,
} from '@/shared/lib/monaco-store';

// Handle messages from extension host (clipboard + file dialog)
window.addEventListener('message', (event) => {
  const message = event.data;

  switch (message.type) {
    // --- Clipboard ---
    case 'clipboard:paste': {
      const text = message.text;
      if (!text) return;
      if (isMonacoFocused()) {
        insertTextInMonaco(text);
      } else {
        document.execCommand('insertText', false, text);
      }
      break;
    }

    case 'clipboard:copy': {
      const text = isMonacoFocused() ? getMonacoSelectedText() : getSelectedText();
      if (text) {
        vscode.postMessage({ type: 'clipboard:write', text });
      }
      break;
    }

    case 'clipboard:cut': {
      const text = isMonacoFocused() ? getMonacoSelectedText() : getSelectedText();
      if (text) {
        vscode.postMessage({ type: 'clipboard:write', text });
        if (isMonacoFocused()) {
          deleteSelectionInMonaco();
        } else {
          document.execCommand('delete');
        }
      }
      break;
    }

    case 'selectAll': {
      if (isMonacoFocused()) {
        selectAllInMonaco();
      } else {
        const el = document.activeElement;
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          el.select();
        } else {
          document.execCommand('selectAll');
        }
      }
      break;
    }

    // --- File dialog result ---
    case 'fileDialogResult': {
      if (!pendingFileDialogCallback) return;
      const files = (message.files as FileDialogFile[]).map(
        (f) => new File([base64ToBlob(f.data, f.mimeType)], f.name, { type: f.mimeType }),
      );
      pendingFileDialogCallback(files);
      pendingFileDialogCallback = null;
      break;
    }
  }
});

function getSelectedText(): string {
  const el = document.activeElement;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    return el.value.substring(start, end);
  }
  return window.getSelection()?.toString() ?? '';
}
