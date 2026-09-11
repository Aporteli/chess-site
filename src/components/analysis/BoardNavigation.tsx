import { Redo2, Undo2 } from 'lucide-react';
import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';

export function BoardNavigation() {
  const historyLength = useAnalysisStore((state) => state.history.length);
  const undoneLength = useAnalysisStore((state) => state.undoneMoves.length);
  const undo = useAnalysisStore((state) => state.undo);
  const redo = useAnalysisStore((state) => state.redo);

  return (
    <div className="flex flex-row justify-center gap-2.5 xl:flex-col">
      <button
        onClick={undo}
        disabled={historyLength === 0}
        aria-label="Undo move"
        className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95 disabled:pointer-events-none disabled:opacity-40 shadow-sm">
        <Undo2 className="h-4 w-4" />
      </button>

      <button
        onClick={redo}
        disabled={undoneLength === 0}
        aria-label="Redo move"
        className="grid h-9 w-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-gold/50 hover:text-accent-gold-bright active:scale-95 disabled:pointer-events-none disabled:opacity-40 shadow-sm">
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}
