import { Chess } from "chess.js";
import type { GameOverReason } from "./types";

export function uciOf(move: {
  from: string;
  to: string;
  promotion?: string;
}): string {
  return move.from + move.to + (move.promotion ?? "");
}

export function endReason(game: Chess): GameOverReason | null {
  if (game.isCheckmate()) return "checkmate";
  if (game.isStalemate()) return "stalemate";
  if (game.isInsufficientMaterial()) return "insufficient";
  if (game.isThreefoldRepetition()) return "threefold";
  return null;
}

export function gameOverCopy(reason: GameOverReason): string {
  if (reason === "checkmate") return "Checkmate";
  if (reason === "stalemate") return "Stalemate";
  if (reason === "insufficient") return "Draw · insufficient material";
  return "Draw · threefold repetition";
}

export function playUci(game: Chess, uci: string) {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci[4].toLowerCase() : undefined;
  try {
    return game.move({ from, to, promotion });
  } catch {
    try {
      return game.move({ from, to });
    } catch {
      return null;
    }
  }
}

export function pickFallbackMove(game: Chess) {
  const legal = game.moves({ verbose: true });
  return legal.find((m) => m.captured) ?? legal[0] ?? null;
}

export function fenTurn(fen: string): "w" | "b" {
  return fen.split(" ")[1] === "b" ? "b" : "w";
}
