import { Chess, DEFAULT_POSITION } from "chess.js";
import type { Square } from "chess.js";

/** Placement + side to move + castling + en passant — the transposition key. */
export function normalizeFen(fen: string): string {
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 4) return fen.trim();
  return parts.slice(0, 4).join(" ");
}

export function fullFen(fen: string): string {
  const parts = fen.trim().split(/\s+/);
  if (parts.length >= 6) return parts.slice(0, 6).join(" ");
  if (parts.length === 4) return `${parts.join(" ")} 0 1`;
  if (parts.length === 5) return `${parts.join(" ")} 1`;
  return fen.trim();
}

export const START_FEN = DEFAULT_POSITION;
export const START_KEY = normalizeFen(DEFAULT_POSITION);

export function fenTurn(fen: string): "w" | "b" {
  const turn = fen.trim().split(/\s+/)[1];
  return turn === "b" ? "b" : "w";
}

export function isOurTurn(fen: string, side: "white" | "black"): boolean {
  const turn = fenTurn(fen);
  return side === "white" ? turn === "w" : turn === "b";
}

export function chessFromFen(fen: string): Chess {
  return new Chess(fullFen(fen));
}

export function isLegalMove(
  fen: string,
  from: string,
  to: string,
  promotion?: string,
): boolean {
  try {
    const chess = chessFromFen(fen);
    const move = chess.move({
      from,
      to,
      promotion: promotion ?? "q",
    });
    return Boolean(move);
  } catch {
    return false;
  }
}

export function playMove(
  fen: string,
  from: string,
  to: string,
  promotion?: string,
) {
  const chess = chessFromFen(fen);
  return chess.move({
    from: from as Square,
    to: to as Square,
    promotion: promotion as "q" | "r" | "b" | "n" | undefined,
  });
}

export function playSan(fen: string, san: string) {
  const chess = chessFromFen(fen);
  return chess.move(san);
}

export function legalMovesFrom(fen: string, square: string) {
  const chess = chessFromFen(fen);
  return chess.moves({ square: square as Square, verbose: true });
}

export function allLegalMoves(fen: string) {
  const chess = chessFromFen(fen);
  return chess.moves({ verbose: true });
}

export function inCheck(fen: string): boolean {
  return chessFromFen(fen).isCheck();
}

export function gameOverReason(fen: string): string | null {
  const chess = chessFromFen(fen);
  if (chess.isCheckmate()) return "checkmate";
  if (chess.isStalemate()) return "stalemate";
  if (chess.isInsufficientMaterial()) return "insufficient";
  if (chess.isThreefoldRepetition()) return "threefold";
  if (chess.isDrawByFiftyMoves()) return "fifty";
  if (chess.isDraw()) return "draw";
  return null;
}

export function needsPromotion(fen: string, from: string, to: string): boolean {
  const chess = chessFromFen(fen);
  const piece = chess.get(from as Square);
  if (!piece || piece.type !== "p") return false;
  const rank = to[1];
  return (
    (piece.color === "w" && rank === "8") || (piece.color === "b" && rank === "1")
  );
}
