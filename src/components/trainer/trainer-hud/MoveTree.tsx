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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface font-sans">
      <div className="shrink-0 bg-bg-surface">
        <MoveTreeHeader moveCount={moveCount} />
      </div>

      <div className="thin-scrollbar grid min-h-0 flex-1 grid-cols-1 gap-x-4 overflow-y-auto overflow-x-hidden rounded-lg bg-bg-elevated p-1.5 [[data-sidebar-collapsed=true]_&]:grid-cols-2">
        {turns.length === 0 && (
          <p className="col-span-full py-4 text-center text-xs text-text-muted">
            No moves yet. Make a move on the board.
          </p>
        )}

        {turns.map((row) => (
          <TurnRowView key={row.turnNumber} row={row} activeNodeId={t.node.id} onJump={t.goToNode} />
        ))}
      </div>
    </div>
  );
}