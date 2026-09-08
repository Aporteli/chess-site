"use client";

import { useTablebaseStore } from "@/stores/tablebase-store";

export function UciHistory() {
  const uciHistory = useTablebaseStore((s) => s.uciHistory);

  return (
    <div className="flex max-h-24 min-h-0 shrink-0 flex-col overflow-hidden rounded-xl bg-surface p-2.5 shadow-[var(--shadow-border)]">
      <h2 className="mb-1.5 shrink-0 font-mono text-2xs uppercase tracking-wider text-muted">
        UCI
      </h2>
      <div className="flex flex-1 flex-wrap content-start gap-1 overflow-y-auto font-mono text-xs">
        {uciHistory.length === 0 ? (
          <span className="text-xs italic text-muted">No moves yet</span>
        ) : (
          uciHistory.map((uci, index) => (
            <span
              key={`${uci}-${index}`}
              className="rounded-sm bg-elevated px-1.5 py-0.5 text-xs text-muted"
            >
              {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ""}
              {uci}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
