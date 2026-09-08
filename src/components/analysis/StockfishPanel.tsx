import StockfishDashboard from "@/components/stockfish/StockfishDashboard";
import { useStockfish } from "@/lib/chess/use-stockfish";
import { useAnalysisStore } from "@/lib/analysis/analysis-store";

export function StockfishPanel() {
  const engine = useStockfish();

  const game = useAnalysisStore((state) => state.game);
  const fen = useAnalysisStore((state) => state.fen);
  const sound = useAnalysisStore((state) => state.sound);

  const handlePlayMove = (ucis: string[]) => {
    const resultFen = useAnalysisStore.getState().playUciMoves(ucis);
    if (!resultFen) return;

    engine.evaluatePosition(resultFen);
  };

  return (
    <StockfishDashboard
      evalScore={engine.evaluation}
      isAnalyzing={engine.isThinking}
      onStart={() => engine.evaluatePosition(fen)}
      onStop={engine.stop}
      settings={engine.settings}
      limits={engine.limits}
      depth={engine.depth}
      nps={engine.nps}
      onSettingsChange={engine.commitSettings}
      analysisLines={engine.lines}
      turn={game.turn()}
      moveNumber={Number(fen.split(" ")[5] || 1)}
      fen={fen}
      enabled={engine.enabled}
      onToggleEnabled={() => engine.setEnabled(!engine.enabled)}
      onPlayMove={handlePlayMove}
    />
  );
}
