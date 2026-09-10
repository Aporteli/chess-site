'use client';

import { nodeCount } from '@/lib/chess';
import { useTrainer } from '@/lib/trainer/context';
import { MoveTreeHeader } from '../move-tree/MoveTreeHeader';
import { TurnRowView } from '../move-tree/TurnRowView';
import { buildMainlineNodes } from '../move-tree/build-line';
import { groupTurns } from '../move-tree/group-turns';

export function MoveTree() {
  const t = useTrainer();

  const fullLineNodes = buildMainlineNodes(t.chapter, t.path);
  const turns = groupTurns(t.chapter, fullLineNodes);
  const moveCount = nodeCount(t.chapter);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-3 font-sans">
      <MoveTreeHeader moveCount={moveCount} />

      <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 thin-scrollbar">
        {turns.length === 0 && (
          <p className="py-4 text-center text-xs text-text-muted">No moves yet. Make a move on the board.</p>
        )}

        {turns.map((row) => (
          <TurnRowView key={row.turnNumber} row={row} activeNodeId={t.node.id} onJump={t.goToNode} />
        ))}
      </div>
    </div>
  );
}
