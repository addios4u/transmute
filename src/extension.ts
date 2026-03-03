import * as vscode from 'vscode';
import { TransmutePanel } from './TransmutePanel';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('transmute.open', () => {
      TransmutePanel.createOrShow(context);
    }),

    // Clipboard: copy — ask webview for selected text
    vscode.commands.registerCommand('transmute.clipboard.copy', () => {
      TransmutePanel.postMessage({ type: 'clipboard:copy' });
    }),

    // Clipboard: cut — ask webview for selected text + delete selection
    vscode.commands.registerCommand('transmute.clipboard.cut', () => {
      TransmutePanel.postMessage({ type: 'clipboard:cut' });
    }),

    // Clipboard: paste — read system clipboard, send text to webview
    vscode.commands.registerCommand('transmute.clipboard.paste', async () => {
      const text = await vscode.env.clipboard.readText();
      TransmutePanel.postMessage({ type: 'clipboard:paste', text });
    }),

    // Select all
    vscode.commands.registerCommand('transmute.selectAll', () => {
      TransmutePanel.postMessage({ type: 'selectAll' });
    }),
  );
}

export function deactivate() {}
