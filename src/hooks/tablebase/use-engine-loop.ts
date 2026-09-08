import { useEffect } from "react";
import { Chess } from "chess.js";
import { applyEngineReply } from "@/lib/tablebase/chess/engine-reply";
import { lookupTablebase } from "@/lib/tablebase/chess/lookup";
import { pickBestMove } from "@/lib/tablebase/chess/minimax";
import { pieceCount } from "@/lib/tablebase/chess/pieces";
import { runtime } from "@/stores/runtime";
import { humanColorOf, useTablebaseStore } from "@/stores/tablebase-store";

export function useEngineLoop() {
  const fen = useTablebaseStore((s) => s.fen);
  const fenValid = useTablebaseStore((s) => s.fenValid);
  const building = useTablebaseStore((s) => s.pipeline !== "idle");
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const result = useTablebaseStore((s) => s.result);
  const resultFen = useTablebaseStore((s) => s.resultFen);
  const loading = useTablebaseStore((s) => s.loading);
  const error = useTablebaseStore((s) => s.error);
  const engineEnabled = useTablebaseStore((s) => s.engineEnabled);
  const flipped = useTablebaseStore((s) => s.flipped);

  useEffect(() => {
    if (!fenValid || building) return;
    const id = window.setTimeout(() => {
      void lookupTablebase(fen);
    }, 80);
    return () => window.clearTimeout(id);
  }, [fen, building, fenValid]);

  useEffect(() => {
    if (!engineEnabled || building || gameOver || !fenValid) return;
    const store = useTablebaseStore.getState();
    const human = humanColorOf(store);
    let probe: Chess;
    try {
      probe = new Chess(fen);
    } catch {
      return;
    }
    if (probe.isGameOver() || probe.turn() === human) return;
    if (runtime.repliedFen === fen) return;
    if (runtime.replyFen !== fen) runtime.replyFen = fen;
    if (result && resultFen === fen && result.moves[0]?.uci) {
      applyEngineReply(fen, result.moves[0].uci);
      return;
    }
    if (loading) return;
    if (error || pieceCount(fen) > 7) {
      const best = pickBestMove(fen, 3);
      applyEngineReply(fen, best?.uci ?? null);
    }
  }, [
    building,
    engineEnabled,
    error,
    fen,
    fenValid,
    flipped,
    gameOver,
    loading,
    result,
    resultFen,
  ]);
}
