'use client';

import { useEngineLoop } from '@/hooks/tablebase/use-engine-loop';
import { useHydrate } from '@/hooks/tablebase/use-hydrate';
import { AnalysisPanel } from './analysis-panel/AnalysisPanel';
import { BoardColumn } from './BoardColumn';
import { ConfirmDialog } from './ConfirmDialog';
import { EndgameCatalog } from './endgame-catalog/EndgameCatalog';
import { FenInput } from './FenInput';
import { ScanModal } from './scan-modal/ScanModal';
import { UciHistory } from './UciHistory';
import { VariationsPanel } from './variations-panel/VariationsPanel';

export function TablebaseChecker() {
  useHydrate();
  useEngineLoop();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 xl:h-full xl:overflow-hidden">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch xl:gap-5 xl:overflow-hidden">
        <BoardColumn />
        <aside className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto xl:col-span-5 xl:h-full xl:overflow-hidden">
          <EndgameCatalog />
          <VariationsPanel />
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
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
