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
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-6  landscape:h-full landscape:overflow-hidden landscape:p-0 lg:h-full lg:overflow-hidden lg:p-0">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 landscape:grid-cols-12 landscape:items-stretch landscape:gap-5 landscape:overflow-hidden lg:grid-cols-12 lg:items-stretch lg:gap-5 lg:overflow-hidden">
        <BoardColumn />
        <aside className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto landscape:col-span-5 landscape:h-full landscape:overflow-hidden lg:col-span-5 lg:h-full lg:overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto ">
            <AnalysisPanel />
            <UciHistory />
            <FenInput />
          </div>
        </aside>
      </div>
      <ScanModal />
      <ConfirmDialog />
    </div>
  );
}
