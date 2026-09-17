"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AnalysisBoardSection } from "@/components/analysis/AnalysisBoardSection";
import { AnalysisControls } from "@/components/analysis/AnalysisControls";
import { UploadBoardModal } from "@/components/board/UploadBoardModal";
import { useAnalysisKeyboard } from "@/lib/analysis/use-analysis-keyboard";
import { useLoadSavedPlay } from "@/lib/analysis/use-load-saved-play";
import { useAnalysisActions } from "@/lib/analysis/use-analysis-actions";
import { useAnalysisStore } from "@/lib/analysis/store/analysis-store";
import { StockfishProvider } from "@/components/stockfish/StockfishContext";

function AnalysisWorkspace() {
  useLoadSavedPlay();
  useAnalysisKeyboard();

  const { loadPosition, closeUploadModal, isUploadBoardOpen } = useAnalysisActions();

  return (
    <AppShell activeKey="analysis">
      <div className="flex h-full min-h-0 flex-1 flex-col p-2">
        <div className="board-workspace w-full [--eval-gutter:1.375rem]">
          <AnalysisBoardSection />
          <AnalysisControls />
        </div>
      </div>

      <UploadBoardModal
        isOpen={isUploadBoardOpen}
        onClose={closeUploadModal}
        onPositionLoaded={loadPosition}
      />
    </AppShell>
  );
}

export default function AnalysisPage() {
  const fen = useAnalysisStore((state) => state.fen);

  return (
    <StockfishProvider fen={fen}>
      <AnalysisWorkspace />
    </StockfishProvider>
  );
}
