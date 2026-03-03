declare function acquireVsCodeApi(): {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
};

interface Window {
  __INITIAL_STATE__?: {
    locale?: string;
  };
}
