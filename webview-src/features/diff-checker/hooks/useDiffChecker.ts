import { useState, useCallback } from "react";

export function useDiffChecker() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [renderSideBySide, setRenderSideBySide] = useState(true);

  const compare = useCallback(() => {

    setIsComparing(true);

  }, []);

  const reset = useCallback(() => {
    setOriginal("");
    setModified("");
    setIsComparing(false);
  }, []);

  return {
    original,
    setOriginal,
    modified,
    setModified,
    isComparing,
    compare,
    reset,
    renderSideBySide,
    setRenderSideBySide,
  };
}
