interface BoardControlsProps {
    moveIndex: number;
    totalMoves: number;
    isFollowingLive: boolean;
    onFirst: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onLast: () => void;
    onGoLive: () => void;
  }
  
  const navButtonClass =
    'flex h-7 min-w-7 items-center justify-center rounded border border-[#383838] bg-[#2A2A2A] px-2 text-xs text-[#A0A0A0] transition-colors hover:border-[#769656] hover:bg-[#383838] hover:text-white';
  
  export function BoardControls({
    moveIndex,
    totalMoves,
    isFollowingLive,
    onFirst,
    onPrevious,
    onNext,
    onLast,
    onGoLive,
  }: BoardControlsProps) {
    return (
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-1">
        <button type="button" onClick={onFirst} className={navButtonClass}>
          ⏮
        </button>
  
        <button type="button" onClick={onPrevious} className={navButtonClass}>
          ◀
        </button>
  
        <span className="min-w-[80px] text-center text-[11px] tabular-nums text-[#A0A0A0]">
          {Math.max(0, moveIndex + 1)} / {totalMoves}
        </span>
  
        <button type="button" onClick={onNext} className={navButtonClass}>
          ▶
        </button>
  
        <button type="button" onClick={onLast} className={navButtonClass}>
          ⏭
        </button>
  
        <button
          type="button"
          onClick={onGoLive}
          disabled={isFollowingLive}
          className={`flex h-7 items-center gap-1.5 rounded border px-2.5 text-[11px] font-medium transition-colors ${
            isFollowingLive
              ? 'cursor-default border-[#769656]/40 bg-[#769656]/15 text-[#769656]'
              : 'border-[#769656] bg-[#769656]/20 text-[#769656] hover:bg-[#769656]/30'
          }`}>
          <span
            className={`size-1.5 rounded-full ${
              isFollowingLive ? 'bg-[#769656]' : 'bg-[#769656] animate-pulse'
            }`}
          />
          Live
        </button>
      </div>
    );
  }