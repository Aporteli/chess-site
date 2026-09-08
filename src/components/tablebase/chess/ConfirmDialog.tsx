"use client";

import { Button } from "@/components/tablebase/ui/button";
import { useTablebaseStore } from "@/stores/tablebase-store";

export function ConfirmDialog() {
  const confirm = useTablebaseStore((s) => s.confirm);
  const setConfirm = useTablebaseStore((s) => s.setConfirm);
  if (!confirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4">
      <div
        role="alertdialog"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
      >
        <h2 id="confirm-title" className="font-display text-lg text-fg">
          {confirm.title}
        </h2>
        <p className="mt-2 text-sm text-muted text-pretty">{confirm.body}</p>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              const run = confirm.run;
              setConfirm(null);
              run();
            }}
          >
            {confirm.confirmLabel ?? "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
