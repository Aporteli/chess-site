'use client';

import { useTablebaseStore } from '@/stores/tablebase-store';

export function BoardActions() {
  const canUndo = useTablebaseStore((s) => s.uciHistory.length > 0);
  const canRedo = useTablebaseStore((s) => s.undoneUcis.length > 0);
  const busy = useTablebaseStore((s) => s.pipeline !== 'idle');
  const undo = useTablebaseStore((s) => s.undo);
  const redo = useTablebaseStore((s) => s.redo);

  return (
    <div className="mt-3 flex items-center justify-center gap-2 w-full">
      <button
        type="button"
        onClick={undo}
        disabled={busy || !canUndo}
        className="rounded-md bg-bg-elevated py-1 px-3 text-[13px] font-medium text-text-secondary border border-border-default shadow hover:bg-bg-surface hover:text-accent-gold-bright transition-colors disabled:opacity-50"
        aria-label="Undo move"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={busy || !canRedo}
        className="rounded-md bg-bg-elevated py-1 px-3 text-[13px] font-medium text-text-secondary border border-border-default shadow hover:bg-bg-surface hover:text-accent-teal-bright transition-colors disabled:opacity-50"
        aria-label="Redo move"
      >
        Redo
      </button>
    </div>
  );
}