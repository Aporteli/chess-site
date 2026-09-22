import type { BroadcastGame } from '../types';
import { parseClock } from '../utils';

interface PlayerBarProps {
  game: BroadcastGame;
  clocks: { white: string | undefined; black: string | undefined };
}

export function PlayerBar({ game, clocks }: PlayerBarProps) {
  return (
    <div className="@container shrink-0 rounded-lg border border-[#383838] bg-[#2A2A2A] px-3 py-2 shadow-lg">
      <div className="flex flex-col gap-2 @min-[28rem]:grid @min-[28rem]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] @min-[28rem]:items-center @min-[28rem]:gap-3">
        {/* WHITE */}
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-white ring-1 ring-[#383838]" />

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              {game.white}
              {game.whiteElo ? ` · ${game.whiteElo}` : ''}
            </p>
          </div>

          <span className="ml-auto shrink-0 rounded border border-[#383838] bg-[#1E1E1E] px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-white">
            {parseClock(clocks.white)}
          </span>
        </div>

        {/* RESULT */}
        <div className="rounded bg-[#1E1E1E] px-2 py-0.5 text-xs font-semibold tabular-nums text-[#769656]">
          {game.result}
        </div>

        {/* BLACK */}
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded border border-[#383838] bg-[#1E1E1E] px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-white">
            {parseClock(clocks.black)}
          </span>

          <div className="ml-auto min-w-0 text-right">
            <p className="truncate text-xs font-semibold text-white">
              {game.black}
              {game.blackElo ? ` · ${game.blackElo}` : ''}
            </p>
          </div>

          <span className="size-2 shrink-0 rounded-full bg-black ring-1 ring-[#383838]" />
        </div>
      </div>
    </div>
  );
}