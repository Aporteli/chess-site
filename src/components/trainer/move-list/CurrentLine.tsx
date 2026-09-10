'use client';

import { memo } from 'react';
import { formatNags, pathToNode } from '@/lib/chess';
import type { NotationMove } from '@/lib/types';
import { useTrainer } from '@/lib/trainer/context';
import { MoveCell } from './MoveCell';

function toRows(t: ReturnType<typeof useTrainer>): {
  rows: NotationMove[];
  activePly: number;
} {
  const ids = pathToNode(t.chapter, t.node.id);
  const rows: NotationMove[] = [];
  let activePly = -1;

  ids.forEach((id) => {
    const node = t.chapter.nodes[id];

    if (!node?.move) return;

    const ply = node.ply - 1;
    const moveNumber = Math.ceil(node.ply / 2);

    if (node.ply % 2 === 1) {
      rows.push({
        moveNumber,
        white: `${node.move.san}${formatNags(node.nags)}`,
        whitePly: ply,
      });
    } else {
      const last = rows[rows.length - 1];

      if (last && last.moveNumber === moveNumber) {
        last.black = `${node.move.san}${formatNags(node.nags)}`;
        last.blackPly = ply;
      } else {
        rows.push({
          moveNumber,
          black: `${node.move.san}${formatNags(node.nags)}`,
          whitePly: -1,
          blackPly: ply,
        });
      }
    }

    if (id === t.node.id) {
      activePly = ply;
    }
  });

  return { rows, activePly };
}

const CurrentLine = memo(function CurrentLine() {
  const trainer = useTrainer();
  const { rows, activePly } = toRows(trainer);

  const jumpPly = (ply: number) => {
    const target = Object.values(trainer.chapter.nodes).find(
      (node) => node.ply === ply + 1 && trainer.path.includes(node.id),
    );

    if (target) {
      trainer.goToNode(target.id);
    }
  };

  return (
    <>
      <div className="mb-2.5 flex items-baseline justify-between border-b border-border-subtle pb-2.5">
        <h3 className="font-serif-display text-[15px] text-text-primary">Current line</h3>

        <span className="font-mono text-[10.5px] tracking-wide text-text-muted">PGN</span>
      </div>

      <div className="max-h-36 space-y-0.5 overflow-y-auto thin-scrollbar">
        {rows.length === 0 && <p className="py-3 text-[12.5px] text-text-muted">Starting position.</p>}

        {rows.map((row, index) => (
          <div
            key={`${row.moveNumber}-${index}`}
            className={['flex items-center gap-1.5 rounded-md', index % 2 === 0 ? 'bg-white/[0.015]' : ''].join(' ')}>
            <span className="w-7 shrink-0 text-right font-mono text-[12px] text-accent-gold/70">{row.moveNumber}.</span>

            <MoveCell san={row.white} ply={row.whitePly} activePly={activePly} onJump={jumpPly} />

            <MoveCell san={row.black} ply={row.blackPly} activePly={activePly} onJump={jumpPly} />
          </div>
        ))}
      </div>
    </>
  );
});

export { CurrentLine };
