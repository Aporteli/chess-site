export const NAMES: Record<string, string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

export const WHITE_GLYPH: Record<string, string> = {
  k: "♔",
  q: "♕",
  r: "♖",
  b: "♗",
  n: "♘",
  p: "♙",
};

export const BLACK_GLYPH: Record<string, string> = {
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

export function glyphsFor(pieces: readonly string[], color: "w" | "b"): string {
  const map = color === "w" ? WHITE_GLYPH : BLACK_GLYPH;
  return pieces.map((p) => map[p] ?? p).join("");
}
