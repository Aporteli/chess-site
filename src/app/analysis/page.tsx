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
      <div className="flex min-h-0 flex-1 flex-col p-3 pb-6 lg:p-4">
        {/* --board-reserve: turn toolbar + undo/redo row stacked with the board */}
        <div className="board-workspace mx-auto w-full max-w-[1500px] [--board-reserve:4.5rem]">
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
