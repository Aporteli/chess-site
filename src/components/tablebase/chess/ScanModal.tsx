"use client";

import { useState } from "react";
import { handlePositionLoaded } from "@/lib/tablebase/chess/scan";
import { Button } from "@/components/tablebase/ui/button";
import { useTablebaseStore } from "@/stores/tablebase-store";

export function ScanModal() {
  const open = useTablebaseStore((s) => s.isUploadOpen);
  const setOpen = useTablebaseStore((s) => s.setUploadOpen);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!open) return null;

  async function load() {
    setBusy(true);
    setMsg(null);
    const ok = await handlePositionLoaded(value.trim());
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
          Paste a FEN. New material types are added to the catalog automatically.
        </p>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          spellCheck={false}
          placeholder="8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"
          className="mt-3 w-full rounded-md bg-elevated p-3 font-mono text-xs text-fg outline-none shadow-[var(--shadow-border)] placeholder:text-subtle"
        />
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
