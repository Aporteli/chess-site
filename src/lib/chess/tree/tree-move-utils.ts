import type { Move } from "chess.js";
import { chessFromFen } from "../fen";
import { EVAL_FROM_NAG, type EvalLabel } from "../nags";
import type { Chapter, StoredMove } from "../types";
import { getNode } from "../tree/tree-navigation";

export function chessAt(chapter: Chapter, nodeId: string) {
  return chessFromFen(getNode(chapter, nodeId).fen);
}

export function formatLine(sans: string[]): string {
  const parts: string[] = [];
  for (let i = 0; i < sans.length; i++) {
    const moveNumber = Math.floor(i / 2) + 1;
    if (i % 2 === 0) parts.push(`${moveNumber}. ${sans[i]}`);
    else parts.push(sans[i]);
  }
  return parts.join(" ");
}

export function moveFromChess(move: Move): StoredMove {
  return {
    san: move.san,
    from: move.from,
    to: move.to,
    promotion: move.promotion,
    uci: `${move.from}${move.to}${move.promotion ?? ""}`,
    captured: move.captured,
    flags: {
      capture: move.isCapture(),
      ep: move.isEnPassant(),
      castle: move.isKingsideCastle() ? "k" : move.isQueensideCastle() ? "q" : null,
      promotion: move.isPromotion(),
      check: move.san.includes("+") || move.san.includes("#"),
      mate: move.san.includes("#"),
    },
  };
}

export function inferEval(nags: number[]): EvalLabel | null {
  for (const nag of nags) {
    const ev = EVAL_FROM_NAG[nag];
    if (ev) return ev;
  }
  return null;
}