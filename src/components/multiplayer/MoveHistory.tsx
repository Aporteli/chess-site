'use client';

interface MoveHistoryProps {
  moves: string[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="flex min-h-[120px] flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-3">
      <div className="mb-1.5 flex shrink-0 items-center justify-between gap-2">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Moves</h2>
        <span className="font-mono text-[11px] text-text-secondary">
          {moves.length} {moves.length === 1 ? 'ply' : 'plies'}
        </span>
      </div>

      <div className="flex flex-1 flex-wrap content-start gap-1 overflow-y-auto pr-1 font-mono text-xs">
        {moves.length === 0 ? (
          <span className="text-xs italic text-text-muted">No moves yet</span>
        ) : (
          moves.map((san, index) => (
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
