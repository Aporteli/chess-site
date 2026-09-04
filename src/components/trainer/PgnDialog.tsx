"use client";

import { useState } from "react";
import { Download, Upload, X } from "lucide-react";
import { useTrainer } from "@/lib/trainer/context";

export function PgnDialog({
  open,
  mode,
  onClose,
}: {
  open: boolean;
  mode: "import" | "export";
  onClose: () => void;
}) {
  const t = useTrainer();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<"chapter" | "repertoire">("chapter");

  if (!open) return null;

  const exported = scope === "chapter" ? t.exportActiveChapter() : t.exportActiveRepertoire();

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-border-default bg-bg-surface shadow-panel">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 className="font-serif-display text-[17px] text-text-primary">
            {mode === "import" ? "Import PGN" : "Export PGN"}
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-text-muted hover:bg-bg-elevated"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          {mode === "export" && (
            <div className="mb-2 flex gap-2">
              <button
                onClick={() => setScope("chapter")}
                className={[
                  "rounded-md px-2 py-1 text-[11px]",
                  scope === "chapter"
                    ? "bg-accent-gold-dim text-accent-gold-bright"
                    : "text-text-muted",
                ].join(" ")}
              >
                This chapter
              </button>
              <button
                onClick={() => setScope("repertoire")}
                className={[
                  "rounded-md px-2 py-1 text-[11px]",
                  scope === "repertoire"
                    ? "bg-accent-gold-dim text-accent-gold-bright"
                    : "text-text-muted",
                ].join(" ")}
              >
                Whole repertoire
              </button>
            </div>
          )}
          <textarea
            value={mode === "export" ? exported : text}
            onChange={(e) => setText(e.target.value)}
            readOnly={mode === "export"}
            rows={14}
            className="w-full resize-none rounded-lg border border-border-default bg-bg-elevated p-3 font-mono text-[12px] text-text-primary outline-none focus:border-accent-gold/40"
            placeholder="Paste a PGN with variations, comments, and NAGs…"
          />
          {message && <p className="mt-2 text-[12px] text-accent-teal-bright">{message}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-border-subtle px-4 py-3">
          {mode === "import" ? (
            <button
              onClick={() => {
                const result = t.importPgnText(text, true);
                setMessage(result.message);
                if (result.ok) setTimeout(onClose, 600);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2 text-[13px] font-semibold text-[#241a10]"
            >
              <Upload className="h-3.5 w-3.5" />
              Import as chapter
            </button>
          ) : (
            <button
              onClick={() => {
                void navigator.clipboard.writeText(exported);
                setMessage("Copied to clipboard.");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2 text-[13px] font-semibold text-[#241a10]"
            >
              <Download className="h-3.5 w-3.5" />
              Copy PGN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
