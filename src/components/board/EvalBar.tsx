'use client';

import { useStockfishEngine } from '@/components/stockfish/StockfishContext';

export function EvalBar({ flipped }: { flipped: boolean }) {
  const { evaluation } = useStockfishEngine();

  const evalScore = evaluation ?? 0;
  const whiteBarHeight = Math.round(((Math.max(-10, Math.min(10, evalScore)) + 10) / 20) * 100);

  const evalLabel =
    evaluation == null
      ? '—'
      : Math.abs(evaluation) >= 99
        ? evaluation > 0
          ? 'M'
          : '-M'
        : evaluation > 0
          ? `+${evaluation.toFixed(1)}`
          : evaluation.toFixed(1);

  return (
    <div
      className={`relative w-3.5 shrink-0 self-stretch overflow-hidden rounded-full border border-accent-gold/50 bg-bg-deepest shadow-lg ${flipped ? 'flex flex-col' : 'flex flex-col justify-end'}`}
      title={evalLabel}>
      <div
        className="w-full bg-text-primary transition-all duration-300"
        style={{ height: `${flipped ? 100 - whiteBarHeight : whiteBarHeight}%` }}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-0.5 w-full -translate-y-1/2 bg-accent-gold/50" />
      <div className="pointer-events-none absolute left-0 right-0" style={{ top: '25%' }}>
        <div className="mx-auto h-0.5 w-full bg-accent-gold/30" />
      </div>
      <div className="pointer-events-none absolute left-0 right-0" style={{ top: '75%' }}>
        <div className="mx-auto h-0.5 w-full bg-accent-gold/30" />
      </div>
    </div>
  );
}
