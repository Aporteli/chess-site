'use client';

import { useEngineLoop } from '@/hooks/tablebase/use-engine-loop';
import { useHydrate } from '@/hooks/tablebase/use-hydrate';
import { AnalysisPanel } from './analysis-panel/AnalysisPanel';
import { BoardColumn } from './BoardColumn';
import { ConfirmDialog } from './ConfirmDialog';
import { FenInput } from './FenInput';
import { ScanModal } from './scan-modal/ScanModal';
import { UciHistory } from './UciHistory';

export function TablebaseChecker() {
  useHydrate();
  useEngineLoop();

  return (
    <div className="flex min-h-0 flex-1 flex-col p-3 pb-6 lg:p-4">
      {/* --board-reserve: turn line above the board + undo/redo row below it */}
      <div className="board-workspace mx-auto w-full max-w-[1500px] [--board-reserve:4.5rem]">
        <BoardColumn />
        <aside className="board-panel thin-scrollbar">
          <AnalysisPanel />
          <UciHistory />
          <FenInput />
        </aside>
      </div>
      <ScanModal />
      <ConfirmDialog />
    </div>
  );
}
