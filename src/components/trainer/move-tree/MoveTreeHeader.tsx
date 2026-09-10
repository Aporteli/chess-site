export function MoveTreeHeader({ moveCount }: { moveCount: number }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between border-b border-border-subtle pb-2">
      <h3 className="font-serif-display text-[15px] font-semibold text-text-primary">
        Repertoire Line
      </h3>
      <span className="font-mono text-[11px] text-text-muted">
        {moveCount} moves in tree
      </span>
    </div>
  );
}