"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AnalysisBoardSection } from "@/components/analysis/AnalysisBoardSection";
import { AnalysisControls } from "@/components/analysis/AnalysisControls";
import { UploadBoardModal } from "@/components/board/UploadBoardModal";
import { useAnalysisKeyboard } from "@/lib/analysis/use-analysis-keyboard";
import { useLoadSavedPlay } from "@/lib/analysis/use-load-saved-play";
import { useAnalysisActions } from "@/lib/analysis/use-analysis-actions";

export default function AnalysisPage() {
  useLoadSavedPlay();
  useAnalysisKeyboard();

  const { loadPosition, closeUploadModal } = useAnalysisActions();

  return (
    <AppShell activeKey="analysis">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 pb-6 xl:overflow-hidden xl:p-3">
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch xl:gap-5 xl:overflow-hidden">
          <AnalysisBoardSection />
          <AnalysisControls />
        </div>
      </div>

      <UploadBoardModal
        isOpen={useAnalysisActions().isUploadBoardOpen}
        onClose={closeUploadModal}
        onPositionLoaded={loadPosition}
      />
    </AppShell>
  );
}
