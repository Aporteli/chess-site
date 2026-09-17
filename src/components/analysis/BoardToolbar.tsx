import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';

export function BoardToolbar() {
  const game = useAnalysisStore((state) => state.game);
  const toggleTurn = useAnalysisStore((state) => state.toggleTurn);

  return (
    <button
      onClick={toggleTurn}
      aria-label="Toggle side to move"
      title="Toggle side to move"
      className="flex w-full shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-subtle,#221d17)] bg-[var(--color-bg-elevated,#1c1815)] px-3.5 py-1.5 font-mono text-xs text-[var(--color-text-secondary,#b9ac91)] shadow-sm transition-all hover:bg-[var(--color-bg-elevated-hover,#262019)] hover:text-[var(--color-accent-gold-bright,#e8c579)]">
      Turn: {game.turn() === 'w' ? 'White' : 'Black'}
    </button>
  );
}
