'use client';

import { formatGames } from '@/lib/chess';
import { useTrainer } from '@/lib/trainer/context';
import { MasterMoveRow } from './MasterMoveRow';
import { MasterNotableGames } from './MasterNotableGames';

export function MasterReference() {
  const t = useTrainer();
  const book = t.master;

  const repertoireSans = new Set(
    t.node.children.map((id) => t.chapter.nodes[id]?.move?.san).filter((san): san is string => Boolean(san)),
  );

  return (
    <div className="hidden rounded-xl border border-border-subtle bg-bg-surface p-4">
      <div className="mb-2.5 flex items-baseline justify-between border-b border-border-subtle pb-2.5">
        <h3 className="font-serif-display text-[15px] text-text-primary">Master book</h3>

        <span className="font-mono text-[10.5px] text-text-muted">
          {book ? `${formatGames(book.games)} games` : 'local'}
        </span>
      </div>

      {!book && (
        <p className="text-[12.5px] leading-relaxed text-text-muted">
          No local master snapshot for this position. Popular tabiyas in the seed files carry Mega-style frequencies;
          import more book data later.
        </p>
      )}

      {book && (
        <>
          <p className="mb-2 text-[11px] text-text-muted">Avg rating {book.avgElo}</p>

          <div className="space-y-1.5">
            {book.moves.map((move) => (
              <MasterMoveRow key={move.san} move={move} repertoireSans={repertoireSans} />
            ))}
          </div>

          <MasterNotableGames games={book.notable} />
        </>
      )}
    </div>
  );
}
