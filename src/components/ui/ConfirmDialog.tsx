"use client";

import { useEffect } from "react";
import { Trash2, X } from "lucide-react";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Delete",
  cancelLabel = "Keep",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        className="w-full max-w-sm rounded-2xl border border-border-default bg-bg-surface shadow-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b border-border-subtle px-4 py-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-accent-garnet/40 bg-accent-garnet-dim text-accent-garnet-bright">
            <Trash2 className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2
              id="confirm-title"
              className="font-serif-display text-[17px] text-text-primary"
            >
              {title}
            </h2>
            <p
              id="confirm-body"
              className="mt-1 text-[13px] leading-relaxed text-text-secondary"
            >
              {body}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border-default bg-bg-elevated px-3 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-accent-garnet/50 bg-accent-garnet-dim px-3 py-2 text-[13px] font-semibold text-accent-garnet-bright hover:border-accent-garnet/80"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
