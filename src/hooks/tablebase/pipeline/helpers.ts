import { Chess } from "chess.js";

export function isValidFen(fen: string): boolean {
  try {
    new Chess(fen);
    return true;
  } catch {
    return false;
  }
}

export function clonePlayed(board: Chess): Chess {
  return new Chess(board.fen());
}

export function playMoveSfx(
  board: Chess,
  move: { from: string; to: string; promotion?: string },
  sound: boolean
) {
  // No-op or sound effect logic stub
}

export function tablebaseScore(category: string, color: "w" | "b"): number | null {
  if (category === "win") return color === "w" ? 100 : -100;
  if (category === "loss") return color === "w" ? -100 : 100;
  if (category === "draw") return 0;
  return null;
}
