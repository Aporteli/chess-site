import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';

export function FenDisplay() {
  const fen = useAnalysisStore((state) => state.fen);

  return (
    <div className="shrink-0 rounded-xl border border-border-subtle bg-bg-surface p-2">
      <span className="mb-0.5 block font-mono text-[8px] uppercase text-text-muted">FEN</span>
      <p className="select-all truncate font-mono text-[9px] text-text-muted">{fen}</p>
    </div>
  );
}
