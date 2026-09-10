'use client';

import { formatGames } from '@/lib/chess';
import type { MasterMoveStat } from '@/lib/chess/types';
import { getMoveShare } from './helpers';

interface MasterMoveRowProps {
  move: MasterMoveStat;
  repertoireSans: Set<string>;
}

export function MasterMoveRow({ move, repertoireSans }: MasterMoveRowProps) {
  const inRepertoire = repertoireSans.has(move.san);
  const share = getMoveShare(move.games, move.games);

  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-center gap-2">
      <span
        className={['font-mono text-[13px]', inRepertoire ? 'text-accent-gold-bright' : 'text-text-primary'].join(' ')}>
        {move.san}
      </span>

      <div>
        <div className="flex h-1.5 overflow-hidden rounded-full bg-bg-deepest">
          <span className="bg-accent-gold" style={{ width: `${move.whiteWinPct}%` }} />

          <span className="bg-text-muted/70" style={{ width: `${move.drawPct}%` }} />

          <span className="bg-accent-garnet" style={{ width: `${move.blackWinPct}%` }} />
        </div>

        <p className="mt-0.5 font-mono text-[10px] text-text-muted">
          {share}% · W{move.whiteWinPct} D{move.drawPct} L{move.blackWinPct} · {move.avgElo}
          {!inRepertoire && <span className="ml-1 text-accent-garnet-bright">not in file</span>}
        </p>
      </div>

      <span className="font-mono text-[10px] text-text-muted">{formatGames(move.games)}</span>
    </div>
  );
}
