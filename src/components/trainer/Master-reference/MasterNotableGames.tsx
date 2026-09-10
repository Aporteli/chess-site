'use client';

interface NotableGame {
  white: string;
  black: string;
  year: number;
  event: string;
  result: string;
}

interface MasterNotableGamesProps {
  games: NotableGame[];
}

export function MasterNotableGames({ games }: MasterNotableGamesProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 space-y-1 border-t border-border-subtle pt-2">
      {games.map((game) => (
        <li key={`${game.white}-${game.black}-${game.year}`} className="text-[11.5px] text-text-secondary">
          <span className="text-text-primary">
            {game.white}–{game.black}
          </span>{' '}
          {game.year} · {game.event} · {game.result}
        </li>
      ))}
    </ul>
  );
}
