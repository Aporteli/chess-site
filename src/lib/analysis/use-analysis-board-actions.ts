import { useCallback } from "react";
import { useStockfish } from "@/lib/chess/use-stockfish";
import { useAnalysisStore } from "./analysis-store";
import { playMoveSound } from "./play-sound";

export function useAnalysisBoardActions() {
  const engine = useStockfish();

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
      if (!targetSquare) return false;

      const { game, sound } = useAnalysisStore.getState();

      try {
        const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        if (!move) return false;

        playMoveSound(move, game.inCheck(), game.isCheckmate(), sound);

        const nextFen = game.fen();
        useAnalysisStore.setState({
          fen: nextFen,
          history: [...useAnalysisStore.getState().history, move.san],
          undoneMoves: [],
          arrows: [],
          revision: useAnalysisStore.getState().revision + 1,
        });

        engine.evaluatePosition(nextFen);
        return true;
      } catch {
        return false;
      }
    },
    [engine.evaluatePosition],
  );

  return { handlePieceDrop, resetEngine: engine.resetEngine };
}
