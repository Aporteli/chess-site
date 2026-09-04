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
  if (parts.length === 3) return `${parts.join(" ")} - 0 1`;
  if (parts.length === 2) return `${parts.join(" ")} - - 0 1`;
  if (parts.length === 1) return `${parts[0]} w - - 0 1`;
  return fen.trim();
}

const FEN_IN_TEXT =
  /(?:[rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+(?:\s+[wb](?:\s+(?:-|[KQkq]+)(?:\s+(?:-|[a-h][36])(?:\s+\d+(?:\s+\d+)?)?)?)?)?/;

/** Pull a legal FEN out of model output (markdown, extra prose, partial fields). */
export function tryParseFen(raw: string): string | null {
  const cleaned = raw.replace(/```(?:fen)?/gi, " ").replace(/\s+/g, " ").trim();
  const match = cleaned.match(FEN_IN_TEXT);
  if (!match) return null;
  try {
    return new Chess(fullFen(match[0])).fen();
  } catch {
    return null;
  }
}

/** Convert 8 rows of 8 chars (KQRBNPkqrbnp.) into a FEN placement + defaults. */
export function gridToFen(rows: string[]): string | null {
  if (rows.length !== 8) return null;

  const ranks: string[] = [];
  for (const row of rows) {
    if (row.length !== 8) return null;
    let out = "";
    let empty = 0;
    for (const ch of row) {
      if (ch === "." || ch === "1") {
        empty++;
      } else if (/^[KQRBNPkqrbnp]$/.test(ch)) {
        if (empty) {
          out += String(empty);
          empty = 0;
        }
        out += ch;
      } else {
        return null;
      }
    }
    if (empty) out += String(empty);
    ranks.push(out);
  }

  try {
    return new Chess(fullFen(`${ranks.join("/")} w - - 0 1`)).fen();
  } catch {
    return null;
  }
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
