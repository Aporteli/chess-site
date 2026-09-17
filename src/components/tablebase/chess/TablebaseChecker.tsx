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
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#121212] p-2 text-white">
      <div className="board-workspace w-full [--eval-gutter:1.375rem]">
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