import type { BroadcastGame } from '../types';

interface GamesListProps {
  games: BroadcastGame[];
  selectedIndex: number;
  selectedRoundId: string | null;
  onSelectGame: (index: number) => void;
}

export function GamesList({
  games,
  selectedIndex,
  selectedRoundId,
  onSelectGame,
}: GamesListProps) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#2A2A2A] shadow-lg">
      <div className="shrink-0 border-b border-[#383838] bg-[#1E1E1E] px-2.5 py-1.5">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]">
          Games · {games.length}
        </h2>

      </div>

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
        {games.map((game, index) => (
          <button
            key={game.id}
            type="button"
            onClick={() => onSelectGame(index)}
            className={`w-full border-b border-[#383838] px-2.5 py-1.5 text-left transition-colors last:border-b-0 ${
              index === selectedIndex ? 'bg-[#4A7C59] text-white' : 'text-white hover:bg-[#383838]'
            }`}>
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[10px] tabular-nums ${
                  index === selectedIndex ? 'text-white/70' : 'text-[#A0A0A0]/60'
                }`}>
                #{index + 1}
              </span>

              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  index === selectedIndex ? 'text-white' : 'text-[#769656]'
                }`}>
                {game.result}
              </span>
            </div>

            <div className="mt-0.5 truncate text-xs font-semibold">{game.white}</div>

            <div
              className={`truncate text-xs ${
                index === selectedIndex ? 'text-white/90' : 'text-[#A0A0A0]'
              }`}>
              {game.black}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}