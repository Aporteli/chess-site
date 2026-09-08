import { Chess } from "chess.js";
import { endReason, playUci, pickFallbackMove, uciOf } from "./moves";
import { playMoveSfx } from "./sounds";
import { haltEngine, runtime } from "@/stores/runtime";
import { humanColorOf, useTablebaseStore } from "@/stores/tablebase-store";

export function applyEngineReply(fromFen: string, uci: string | null): boolean {
  if (runtime.replyFen !== fromFen) return false;
  if (runtime.repliedFen === fromFen) return false;
  let next: Chess;
  try {
    next = new Chess(fromFen);
  } catch {
    return false;
  }
  let move = null;
  if (uci && uci !== "(none)" && uci.length >= 4) {
    move = playUci(next, uci);
  }
  if (!move) {
    const fallback = pickFallbackMove(next);
    if (fallback) {
      try {
        move = next.move({
          from: fallback.from,
          to: fallback.to,
          promotion: fallback.promotion,
        });
      } catch {
        move = null;
      }
    }
  }
  runtime.repliedFen = fromFen;
  runtime.replyFen = null;
  const store = useTablebaseStore.getState();
  if (!move) {
    const reason = endReason(next);
    if (reason) useTablebaseStore.setState({ gameOver: reason });
    return true;
  }
  playMoveSfx(next, move, store.sound);
  store.applyPlayedFen(next.fen(), uciOf(move));
  const reason = endReason(next);
  if (reason) useTablebaseStore.setState({ gameOver: reason });
  return true;
}

export function armEngineReply(fromFen: string) {
  const store = useTablebaseStore.getState();
  if (!store.engineEnabled) return;
  try {
    const probe = new Chess(fromFen);
    if (probe.isGameOver() || probe.turn() === humanColorOf(store)) return;
  } catch {
    return;
  }
  if (runtime.repliedFen === fromFen) return;
  runtime.replyFen = fromFen;
}

export { haltEngine };
