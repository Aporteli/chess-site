"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";

interface UploadBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPositionLoaded: (fen: string) => boolean | void;
}

export function UploadBoardModal({ isOpen, onClose, onPositionLoaded }: UploadBoardModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onClose, onPositionLoaded, toUploadFile],
  );

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoading(false);
      setDragging(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-bg-surface shadow-panel">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 className="font-serif-display text-[17px] text-text-primary">Scan board</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-text-muted hover:bg-bg-elevated"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-[13px] text-text-secondary">
            Upload a diagram screenshot, drop a file, or paste from the clipboard (Ctrl+V).
          </p>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) void recognize(file);
            }}
            className={[
              "mt-4 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
              dragging
                ? "border-accent-gold/60 bg-accent-gold-dim"
                : "border-border-subtle hover:border-text-muted",
            ].join(" ")}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-accent-gold-bright" />
                <span className="text-[13px] text-text-muted">Reading pieces…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Camera className="h-10 w-10 text-text-muted" />
                <span className="text-[13px] font-medium text-text-primary">
                  Choose image (PNG, JPG, WEBP)
                </span>
                <span className="text-[12px] text-text-muted">or drop / paste a screenshot</span>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void recognize(file);
              }}
            />
          </label>

          {error && <p className="mt-3 text-[12px] text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
