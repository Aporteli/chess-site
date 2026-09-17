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
    /* bg-[#121212] - ყველაზე მუქი ძირითადი ფონი, რომელიც ქმნის სიღრმეს */
    <div className="flex min-h-0 flex-1 flex-col bg-[#121212] p-3 pb-6 text-white lg:p-4">
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