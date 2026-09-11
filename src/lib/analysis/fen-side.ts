export type SideToMove = "w" | "b";

export const getSideToMove = (fen: string): SideToMove => {
  const turn = fen.trim().split(/\s+/)[1];
  return turn === "b" ? "b" : "w";
};

export const setSideToMove = (fen: string, turn: SideToMove): string => {
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 2) return fen;

  if (parts[1] === turn) return fen;

  parts[1] = turn;
  // En passant is only legal for the side that just moved, so clear it when the
  // turn changes to keep the resulting FEN valid.
  if (parts.length >= 4) parts[3] = "-";

  return parts.join(" ");
};
