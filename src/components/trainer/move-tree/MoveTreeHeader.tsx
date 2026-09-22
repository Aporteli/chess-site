export function MoveTreeHeader({ moveCount }: { moveCount: number }) {
  return (
    <div className="pb-1 pl-1 flex bg-bg-accent-bright items-baseline justify-between ">
      <span className="font-mono text-[11px] text-bg-deepest">
        {moveCount} moves in tree
      </span>
    </div>
  );
}