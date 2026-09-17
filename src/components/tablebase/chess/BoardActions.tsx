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
        className="rounded-md bg-[#2A2A2A] py-1.5 px-3.5 font-mono text-[13px] font-medium text-[#A0A0A0] border border-[#383838] transition-colors hover:bg-[#383838] hover:text-white disabled:opacity-40 disabled:hover:bg-[#2A2A2A] disabled:hover:text-[#A0A0A0]"
        aria-label="Undo move"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={busy || !canRedo}
        className="rounded-md bg-[#2A2A2A] py-1.5 px-3.5 font-mono text-[13px] font-medium text-[#A0A0A0] border border-[#383838] transition-colors hover:bg-[#383838] hover:text-white disabled:opacity-40 disabled:hover:bg-[#2A2A2A] disabled:hover:text-[#A0A0A0]"
        aria-label="Redo move"
      >
        Redo
      </button>
    </div>
  );
}