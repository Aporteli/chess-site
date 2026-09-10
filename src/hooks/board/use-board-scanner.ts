import { useCallback, useEffect, useState } from "react";

interface UseBoardScannerOptions {
  isOpen: boolean;
  onClose: () => void;
  onPositionLoaded: (fen: string) => boolean | void;
}

export function useBoardScanner({ isOpen, onClose, onPositionLoaded }: UseBoardScannerOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toUploadFile = useCallback(async (file: File) => {
    try {
      const bmp = await createImageBitmap(file);
      const max = 1600;
      const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
      const w = Math.round(bmp.width * scale);
      const h = Math.round(bmp.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(bmp, 0, 0, w, h);
      bmp.close();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.85),
      );
      if (!blob) return file;
      return new File([blob], "board.jpg", { type: "image/jpeg" });
    } catch {
      return file;
    }
  }, []);

  const recognize = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", await toUploadFile(file));

      try {
        const res = await fetch("/api/chess/extract-fen", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as { fen?: string; error?: string };
        if (!res.ok) throw new Error(data.error || "Could not read that image");
        if (!data.fen) throw new Error("No position came back from the scanner");
        const ok = onPositionLoaded(data.fen);
        if (ok === false) throw new Error("That FEN could not be loaded onto the board");
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Recognition failed");
      } finally {
        setLoading(false);
      }
    },
    [onClose, onPositionLoaded, toUploadFile],
  );

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoading(false);
      return;
    }

    const onPaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.files ?? [])].find((item) => item.type.startsWith("image/"));
      if (file) {
        e.preventDefault();
        void recognize(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [isOpen, recognize]);

  return { loading, error, recognize };
}