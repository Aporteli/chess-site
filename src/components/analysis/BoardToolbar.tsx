import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';

export function BoardToolbar() {
  const game = useAnalysisStore((state) => state.game);
  const toggleTurn = useAnalysisStore((state) => state.toggleTurn);

  return (
    <div className="mb-1.5 flex w-full shrink-0 items-center justify-between px-1 xl:w-[min(100cqw-4.5rem,calc(100dvh-10rem))]">
      <button
        onClick={toggleTurn}
        aria-label="Toggle side to move"
        title="Toggle side to move"
        className="rounded-md border border-border-default bg-bg-surface px-2 py-1 font-mono text-xs text-[var(--color-text-muted,#7d735d)] transition-colors hover:border-accent-teal/50 hover:text-accent-teal-bright active:scale-95">
        სვლა: {game.turn() === 'w' ? 'თეთრები' : 'შავები'}
      </button>
    </div>
  );
}
