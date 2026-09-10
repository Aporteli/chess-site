"use client";

import { RefObject } from "react";
import { Camera, Loader2 } from "lucide-react";

interface ScanDropzoneProps {
  dragging: boolean;
  busy: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ScanDropzone({
  dragging,
  busy,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  onFileChange,
}: ScanDropzoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 transition ${
        dragging
          ? "border-accent-gold bg-accent-gold-dim/20"
          : "border-subtle bg-elevated hover:border-accent-gold/60"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      {busy ? (
        <div className="flex items-center gap-2 text-xs text-muted">
          <Loader2 className="size-4 animate-spin text-accent-gold" />
          <span>Scanning board image…</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Camera className="size-4 text-accent-gold" />
            <span>Click to upload or drag & drop board image</span>
          </div>
          <span className="text-micro text-subtle">PNG, JPG, WEBP</span>
        </>
      )}
    </div>
  );
}