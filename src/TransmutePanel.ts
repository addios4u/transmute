import * as vscode from 'vscode';
import * as path from 'path';

export class TransmutePanel {
  public static readonly viewType = 'transmute.panel';

  private static currentPanel: TransmutePanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly context: vscode.ExtensionContext;
  private disposed = false;

  public static createOrShow(context: vscode.ExtensionContext): void {
    if (TransmutePanel.currentPanel) {
      TransmutePanel.currentPanel.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      TransmutePanel.viewType,
      'Transmute',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'out'),
        ],
      }
    );

    TransmutePanel.currentPanel = new TransmutePanel(panel, context);
  }

  public static postMessage(message: unknown): void {
    TransmutePanel.currentPanel?.panel.webview.postMessage(message);
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this.panel = panel;
    this.context = context;

    this.panel.webview.html = this.getHtmlForWebview(this.panel.webview);

    this.panel.webview.onDidReceiveMessage(
      (message) => this.handleMessage(message),
      undefined,
      context.subscriptions
    );

    this.panel.onDidDispose(() => this.dispose(), null, context.subscriptions);
  }

  private async handleMessage(message: { type: string; [key: string]: unknown }) {
    switch (message.type) {
      case 'openExternal':
        if (typeof message.url === 'string') {
          vscode.env.openExternal(vscode.Uri.parse(message.url));
        }
        break;

      case 'clipboard:write':
        if (typeof message.text === 'string') {
          await vscode.env.clipboard.writeText(message.text);
        }
        break;

      case 'openFileDialog': {
        const filters = message.filters as Record<string, string[]> | undefined;
        const multiple = message.multiple === true;

        const uris = await vscode.window.showOpenDialog({
          canSelectFiles: true,
          canSelectFolders: false,
          canSelectMany: multiple,
          filters: filters ?? { 'All Files': ['*'] },
        });

        if (!uris || uris.length === 0) {
          this.panel.webview.postMessage({ type: 'fileDialogResult', files: [] });
          return;
        }

        const files = await Promise.all(
          uris.map(async (uri) => {
            const data = await vscode.workspace.fs.readFile(uri);
            const name = path.basename(uri.fsPath);
            const ext = path.extname(uri.fsPath).toLowerCase();
            return {
              name,
              data: Buffer.from(data).toString('base64'),
              mimeType: getMimeType(ext),
            };
          })
        );

        this.panel.webview.postMessage({ type: 'fileDialogResult', files });
        break;
      }
    }
  }

  private dispose() {
    TransmutePanel.currentPanel = undefined;
    this.panel.dispose();
    this.disposed = true;
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const jsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'out', 'webview', 'webview.js')
    );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'out', 'webview', 'webview.css')
    );
    const nonce = getNonce();

    const locale = vscode.env.language || 'en';

    return /* html */ `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource} data:; img-src ${webview.cspSource} data: blob: https://cdn.buymeacoffee.com; worker-src blob:; connect-src data: blob:;">
  <link rel="stylesheet" href="${cssUri}">
  <title>Transmute</title>
  <script nonce="${nonce}">
    window.__INITIAL_STATE__ = { locale: "${locale}" };
  </script>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${jsUri}"></script>
</body>
</html>`;
  }
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
  };
  return map[ext] ?? 'application/octet-stream';
}
