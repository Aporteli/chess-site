"use client";

import { X } from "lucide-react";
import { ImageDropzone } from "./ImageDropzone";
import { useBoardScanner } from "@/hooks/board/use-board-scanner";

interface UploadBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPositionLoaded: (fen: string) => boolean | void;
}

export function UploadBoardModal({ isOpen, onClose, onPositionLoaded }: UploadBoardModalProps) {
  const { loading, error, recognize } = useBoardScanner({ isOpen, onClose, onPositionLoaded });

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

          <ImageDropzone loading={loading} onFileSelect={(file) => void recognize(file)} />

          {error && <p className="mt-3 text-[12px] text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}