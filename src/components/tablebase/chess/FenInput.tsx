"use client";

import { useTablebaseStore } from "@/stores/tablebase-store";

export function FenInput() {
  const fenInput = useTablebaseStore((s) => s.fenInput);
  const fenValid = useTablebaseStore((s) => s.fenValid);
  const applyFenInput = useTablebaseStore((s) => s.applyFenInput);

  return (
    <label className="block shrink-0 h-14 rounded-xl bg-surface p-2 shadow-[var(--shadow-border)] flex flex-col justify-center">
      <span className="mb-0.5 block font-mono text-2xs uppercase tracking-wider text-muted">
        FEN
      </span>
      <input
        type="text"
        value={fenInput}
        onChange={(e) => applyFenInput(e.target.value)}
        spellCheck={false}
        className={`w-full bg-transparent font-mono text-2xs outline-none ${
          fenValid ? "text-muted" : "text-danger"
        }`}
      />
    </label>
  );
}

