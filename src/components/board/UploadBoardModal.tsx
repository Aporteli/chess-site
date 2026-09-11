"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ImageDropzone } from "./ImageDropzone";
import { useBoardScanner } from "@/hooks/board/use-board-scanner";
import { getSideToMove, setSideToMove as applySideToMove, type SideToMove } from "@/lib/analysis/fen-side";

interface UploadBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPositionLoaded: (fen: string) => boolean | void;
}

export function UploadBoardModal({ isOpen, onClose, onPositionLoaded }: UploadBoardModalProps) {
  const [recognizedFen, setRecognizedFen] = useState<string | null>(null);
  const [sideToMove, setSideToMove] = useState<SideToMove>("w");

  const handleRecognized = useCallback((fen: string) => {
    setRecognizedFen(fen);
    setSideToMove(getSideToMove(fen));
  }, []);

  const { loading, error, recognize } = useBoardScanner({
    isOpen,
    onRecognized: handleRecognized,
  });

  useEffect(() => {
    if (isOpen) {
      setRecognizedFen(null);
      setSideToMove("w");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoad = () => {
    if (!recognizedFen) return;

    const fen = applySideToMove(recognizedFen, sideToMove);
    const ok = onPositionLoaded(fen);
    if (ok === false) return;

    onClose();
  };

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
          {recognizedFen ? (
            <div className="flex flex-col gap-3">
              <p className="text-[13px] text-text-secondary">Position detected. Choose who moves next:</p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSideToMove("w")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    sideToMove === "w"
                      ? "border-accent-teal bg-accent-teal-dim text-accent-teal-bright"
                      : "border-border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary"
                  }`}
                >
                  White to move
                </button>
                <button
                  type="button"
                  onClick={() => setSideToMove("b")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    sideToMove === "b"
                      ? "border-accent-teal bg-accent-teal-dim text-accent-teal-bright"
                      : "border-border-subtle bg-bg-elevated text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Black to move
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLoad}
                  className="flex-1 rounded-lg border border-accent-gold/35 bg-bg-elevated px-3.5 py-2 text-xs font-semibold text-accent-gold-bright shadow-sm transition-all hover:border-accent-gold/70 hover:bg-accent-gold-dim"
                >
                  Load board
                </button>
                <button
                  type="button"
                  onClick={() => setRecognizedFen(null)}
                  className="rounded-lg border border-border-subtle bg-bg-elevated px-3.5 py-2 text-xs text-text-secondary transition-colors hover:text-text-primary"
                >
                  Scan again
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-text-secondary">
                Upload a diagram screenshot, drop a file, or paste from the clipboard (Ctrl+V).
              </p>

              <ImageDropzone loading={loading} onFileSelect={(file) => void recognize(file)} />
            </>
          )}

          {error && <p className="mt-3 text-[12px] text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}