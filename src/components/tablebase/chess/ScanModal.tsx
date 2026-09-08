"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { handlePositionLoaded } from "@/lib/tablebase/chess/scan";
import { Button } from "@/components/tablebase/ui/button";
import { useTablebaseStore } from "@/stores/tablebase-store";
import { Camera, Loader2 } from "lucide-react";

export function ScanModal() {
  const open = useTablebaseStore((s) => s.isUploadOpen);
  const setOpen = useTablebaseStore((s) => s.setUploadOpen);
  const [value, setValue] = useState("");
  const [sideToMove, setSideToMove] = useState<"w" | "b">("w");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const recognizeImage = useCallback(
    async (file: File) => {
      setBusy(true);
      setMsg(null);
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
        
        const ok = await handlePositionLoaded(data.fen, sideToMove);
        if (!ok) throw new Error("That FEN could not be loaded onto the tablebase");
        setValue("");
        setOpen(false);
      } catch (err) {
        setMsg(err instanceof Error ? err.message : "Recognition failed");
      } finally {
        setBusy(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [sideToMove, setOpen, toUploadFile],
  );

  useEffect(() => {
    if (!open) {
      setMsg(null);
      setBusy(false);
      setDragging(false);
      return;
    }
    const onPaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.files ?? [])].find((item) => item.type.startsWith("image/"));
      if (file) {
        e.preventDefault();
        void recognizeImage(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [open, recognizeImage]);

  if (!open) return null;

  async function load() {
    if (!value.trim()) return;
    setBusy(true);
    setMsg(null);
    const ok = await handlePositionLoaded(value.trim(), sideToMove);
    setBusy(false);
    if (ok) {
      setValue("");
      setOpen(false);
      return;
    }
    setMsg("Could not load that FEN. Check both kings are present.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center">
      <div
        role="dialog"
        aria-labelledby="scan-title"
        className="w-full max-w-lg rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
      >
        <h2 id="scan-title" className="font-display text-lg text-fg">
          Add a position
        </h2>
        <p className="mt-1 text-sm text-muted text-pretty">
          Upload an image screenshot, drop a file, paste from clipboard (Ctrl+V), or enter FEN manually.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
              void recognizeImage(file);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                void recognizeImage(file);
              }
            }}
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

        <div className="relative my-3 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-subtle" />
          </div>
          <span className="relative bg-surface px-2 text-2xs uppercase text-subtle">or paste FEN</span>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          spellCheck={false}
          placeholder="8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"
          className="w-full rounded-md bg-elevated p-3 font-mono text-xs text-fg outline-none shadow-[var(--shadow-border)] placeholder:text-subtle"
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted">Side to move:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setSideToMove("w")}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                sideToMove === "w"
                  ? "bg-accent-gold-bright text-bg-deepest font-semibold"
                  : "bg-elevated text-muted hover:text-fg"
              }`}
            >
              White
            </button>
            <button
              type="button"
              onClick={() => setSideToMove("b")}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                sideToMove === "b"
                  ? "bg-accent-gold-bright text-bg-deepest font-semibold"
                  : "bg-elevated text-muted hover:text-fg"
              }`}
            >
              Black
            </button>
          </div>
        </div>

        {msg && <p className="mt-2 text-micro text-danger">{msg}</p>}
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={busy || !value.trim()}
            onClick={() => void load()}
          >
            {busy ? "Loading…" : "Load FEN"}
          </Button>
        </div>
      </div>
    </div>
  );
}
