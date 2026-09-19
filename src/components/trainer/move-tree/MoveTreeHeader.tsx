export function MoveTreeHeader({ moveCount }: { moveCount: number }) {
  return (
    <div className="pb-1 pl-1 flex items-baseline justify-between border-b border-border-subtle">
      <span className="font-mono text-[11px] text-text-muted">
        {moveCount} moves in tree
      </span>
    </div>
  );
}