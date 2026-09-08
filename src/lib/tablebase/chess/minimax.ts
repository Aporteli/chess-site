import { Chess, type Move } from "chess.js";
import { uciOf } from "./moves";
import type { EngineLine } from "./types";

const VAL: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
};

function evalBoard(chess: Chess): number {
  let s = 0;
  for (const row of chess.board()) {
    for (const p of row) {
      if (!p) continue;
      const v = VAL[p.type] ?? 0;
      s += p.color === "w" ? v : -v;
    }
  }
  const mobility = chess.moves().length;
  s += chess.turn() === "w" ? mobility : -mobility;
  return s;
}

function terminalScore(chess: Chess): number | null {
  if (chess.isCheckmate()) return chess.turn() === "w" ? -100000 : 100000;
  if (chess.isDraw() || chess.isGameOver()) return 0;
  return null;
}

function search(chess: Chess, depth: number, alpha: number, beta: number): number {
  const term = terminalScore(chess);
  if (term != null) return term;
  if (depth <= 0) return evalBoard(chess);
  const moves = chess.moves({ verbose: true });
  moves.sort((a, b) => Number(Boolean(b.captured)) - Number(Boolean(a.captured)));
  const maxing = chess.turn() === "w";
  let best = maxing ? -Infinity : Infinity;
  for (const m of moves) {
    chess.move(m);
    const sc = search(chess, depth - 1, alpha, beta);
    chess.undo();
    if (maxing) {
      best = Math.max(best, sc);
      alpha = Math.max(alpha, sc);
    } else {
      best = Math.min(best, sc);
      beta = Math.min(beta, sc);
    }
    if (beta <= alpha) break;
  }
  return best;
}

function scoreMove(fen: string, move: Move, depth: number): number {
  const chess = new Chess(fen);
  chess.move(move);
  return search(chess, depth - 1, -Infinity, Infinity);
}

export function pickBestMove(
  fen: string,
  depth = 3,
): { uci: string; evaluation: number } | null {
  const chess = new Chess(fen);
  if (chess.isGameOver()) return null;
  const moves = chess.moves({ verbose: true });
  if (!moves.length) return null;
  const maxing = chess.turn() === "w";
  let bestMove = moves[0]!;
  let best = maxing ? -Infinity : Infinity;
  for (const m of moves) {
    const sc = scoreMove(fen, m, depth);
    if (maxing ? sc > best : sc < best) {
      best = sc;
      bestMove = m;
    }
  }
  return { uci: uciOf(bestMove), evaluation: best / 100 };
}

export function analyzePosition(fen: string, depth = 2, k = 4): EngineLine[] {
  try {
    const chess = new Chess(fen);
    if (chess.isGameOver()) return [];
    const moves = chess.moves({ verbose: true });
    const maxing = chess.turn() === "w";
    const ranked = moves
      .map((m) => ({ m, sc: scoreMove(fen, m, depth) }))
      .sort((a, b) => (maxing ? b.sc - a.sc : a.sc - b.sc))
      .slice(0, k);
    return ranked.map((row, i) => ({
      multipv: i + 1,
      uci: uciOf(row.m),
      pv: uciOf(row.m),
      evaluation: row.sc / 100,
      depth,
      san: row.m.san,
    }));
  } catch {
    return [];
  }
}
