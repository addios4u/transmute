import type { editor } from 'monaco-editor';

let activeEditor: editor.IStandaloneCodeEditor | null = null;

export function setActiveMonacoEditor(ed: editor.IStandaloneCodeEditor | null): void {
  activeEditor = ed;
}

export function isMonacoFocused(): boolean {
  return activeEditor !== null && document.activeElement?.closest('.monaco-editor') !== null;
}

export function getMonacoSelectedText(): string {
  if (!activeEditor) return '';
  const selection = activeEditor.getSelection();
  if (!selection) return '';
  return activeEditor.getModel()?.getValueInRange(selection) ?? '';
}

export function insertTextInMonaco(text: string): void {
  if (!activeEditor) return;
  const selection = activeEditor.getSelection();
  if (!selection) return;
  activeEditor.executeEdits('clipboard-paste', [{
    range: selection,
    text,
    forceMoveMarkers: true,
  }]);
}

export function selectAllInMonaco(): void {
  if (!activeEditor) return;
  const model = activeEditor.getModel();
  if (!model) return;
  const fullRange = model.getFullModelRange();
  activeEditor.setSelection(fullRange);
}

export function deleteSelectionInMonaco(): void {
  if (!activeEditor) return;
  const selection = activeEditor.getSelection();
  if (!selection) return;
  activeEditor.executeEdits('clipboard-cut', [{
    range: selection,
    text: '',
    forceMoveMarkers: true,
  }]);
}
