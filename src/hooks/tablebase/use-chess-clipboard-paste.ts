import { useEffect } from "react";

export function useChessClipboardPaste(open: boolean, onImageFile: (file: File) => void) {
  useEffect(() => {
    if (!open) return;
    const onPaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.files ?? [])].find((item) => item.type.startsWith("image/"));
      if (file) {
        e.preventDefault();
        onImageFile(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [open, onImageFile]);
}