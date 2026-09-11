import { useStockfishEngine } from '@/components/stockfish/StockfishContext';
import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';

export function MoveHistory() {
  const history = useAnalysisStore((state) => state.history);
  const engine = useStockfishEngine();

  return (
    <div className="flex min-h-[120px] flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-3">
      <div className="mb-1.5 flex shrink-0 items-center justify-between gap-2">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">სვლების ისტორია</h2>
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${
              engine.isThinking
                ? 'border border-accent-teal bg-accent-teal-dim text-accent-teal-bright'
                : 'bg-bg-elevated text-text-secondary'
            }`}>
            {engine.isThinking ? 'Calculating' : 'Idle'}
          </span>
          <span className="font-mono text-sm font-semibold text-accent-gold-bright">
            {engine.evaluation !== null
              ? engine.evaluation > 0
                ? `+${engine.evaluation}`
                : engine.evaluation
              : '0.00'}
          </span>
          <span className="truncate rounded border border-border-subtle bg-accent-teal-dim px-1.5 py-0.5 font-mono text-[11px] font-semibold text-accent-teal-bright">
            {engine.bestMove ?? '—'}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-wrap content-start gap-1 overflow-y-auto pr-1 font-mono text-xs">
        {history.length === 0 ? (
          <span className="text-xs italic text-text-muted">სვლები ჯერ არ გაკეთებულა</span>
        ) : (
          history.map((san, index) => (
            <span
              key={`${san}-${index}`}
              className="rounded border border-border-subtle bg-bg-elevated px-1.5 py-0.5 text-xs text-text-secondary">
              {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ''}
              {san}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
