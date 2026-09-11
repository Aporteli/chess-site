'use client';

import { useTablebaseStore } from '@/stores/tablebase-store';

export function UciHistory() {
  const uciHistory = useTablebaseStore((s) => s.uciHistory);

  return (
    <div className="flex flex-1 min-h-0 w-full flex-col overflow-hidden rounded-xl bg-surface p-2.5 shadow-[var(--shadow-border)]">
      <h2 className="mb-1.5 shrink-0 font-mono text-2xs uppercase tracking-wider text-muted">UCI</h2>
      <div className="min-h-0 flex-1 overflow-y-auto font-mono text-xs thin-scrollbar">
        {uciHistory.length === 0 ? (
          <span className="text-xs italic text-muted">No moves yet</span>
        ) : (
          <div className="flex flex-wrap content-start gap-1">
            {uciHistory.map((uci, index) => (
              <span key={`${uci}-${index}`} className="rounded-sm bg-elevated px-1.5 py-0.5 text-xs text-muted">
                {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ''}
                {uci}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

