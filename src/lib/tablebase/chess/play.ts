import { Chess } from "chess.js";
import { pickBestMove } from "./minimax";
import { endReason, uciOf } from "./moves";
import { playMoveSfx } from "./sounds";
import { haltEngine, runtime } from "@/stores/runtime";
import { humanColorOf, useTablebaseStore } from "@/stores/tablebase-store";
import { armEngineReply } from "./engine-reply";

export function handlePieceDrop(args: {
  sourceSquare: string;
  targetSquare: string | null;
}): boolean {
  const { sourceSquare, targetSquare } = args;
  if (!targetSquare) return false;
  const store = useTablebaseStore.getState();
  if (store.pipeline !== "idle" || store.gameOver) return false;
  try {
    const next = new Chess(store.fen);
    if (next.turn() !== humanColorOf(store)) return false;
    const move = next.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (!move) return false;
    playMoveSfx(next, move, store.sound);
    runtime.hintPending = false;
    runtime.hintFen = null;
    store.applyPlayedFen(next.fen(), uciOf(move));
    const reason = endReason(next);
    if (reason) useTablebaseStore.setState({ gameOver: reason });
    else armEngineReply(next.fen());
    return true;
  } catch {
    return false;
  }
}

export function playUcis(ucis: string[]): boolean {
  const store = useTablebaseStore.getState();
  if (store.pipeline !== "idle" || store.gameOver || !ucis.length) return false;
  haltEngine();
  const next = new Chess(store.fen);
  const played: string[] = [];
  for (const uci of ucis) {
    let move;
    try {
      move = next.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4],
      });
    } catch {
      return false;
    }
    if (!move) return false;
    playMoveSfx(next, move, store.sound);
    played.push(uciOf(move));
  }
  useTablebaseStore.setState({
    fen: next.fen(),
    fenInput: next.fen(),
    fenValid: true,
    uciHistory: [...store.uciHistory, ...played],
    result: null,
    hintUci: null,
    localLines: [],
  });
  const reason = endReason(next);
  if (reason) useTablebaseStore.setState({ gameOver: reason });
  else if (next.turn() !== humanColorOf(store)) armEngineReply(next.fen());
  return true;
}

export function handleHint() {
  const store = useTablebaseStore.getState();
  const human = humanColorOf(store);
  const turn = store.fen.split(" ")[1];
  if (store.pipeline !== "idle" || store.gameOver || turn !== human) return;
  haltEngine();
  runtime.hintFen = store.fen;
  runtime.hintPending = true;
  const existing =
    store.result?.moves?.[0]?.uci ?? store.localLines[0]?.uci ?? null;
  if (existing && existing.length >= 4) {
    runtime.hintPending = false;
    store.setHintUci(existing);
    return;
  }
  store.setHintUci(null);
  const best = pickBestMove(store.fen, 3);
  runtime.hintPending = false;
  if (best) store.setHintUci(best.uci);
}

export function handleReset() {
  const store = useTablebaseStore.getState();
  haltEngine();
  store.commitFen(
    store.activeCard?.fen ?? store.catalog[store.endgameIndex]?.fen ?? store.fen,
  );
}
