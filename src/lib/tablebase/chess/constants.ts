export const FILES = "abcdefgh";

export const ALL_SQUARES = Array.from(
  { length: 64 },
  (_, i) => FILES[i % 8] + String(8 - Math.floor(i / 8)),
);

export const GENERATE_ATTEMPTS = 500;
export const DECK_KEY = "tablebase:deck:v2";
export const KINDS_KEY = "tablebase:kinds:v1";
export const HIDDEN_KEY = "tablebase:hidden-kinds:v1";
export const PIECE_ORDER = ["k", "q", "r", "b", "n", "p"] as const;
export const DECK_BATCH = 8;
export const WIN_EVAL = 3;
