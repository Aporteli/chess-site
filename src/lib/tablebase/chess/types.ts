export type EndgameKind = string;

export type EndgamePieces = {
  white: readonly string[];
  black: readonly string[];
};

export type EndgameEntry = {
  id: EndgameKind;
  label: string;
  icons: string;
  fen: string;
};

export type EngineLine = {
  multipv: number;
  uci: string;
  pv: string;
  evaluation: number;
  depth: number;
  san?: string;
};

export type EndgameCard = {
  id: string;
  fen: string;
  kind: EndgameKind;
  evaluation: number | null;
  bestMove: string | null;
  depth: number;
  lines: EngineLine[];
  createdAt: number;
};

export type EndgameDeck = {
  id: string;
  name: string;
  cards: EndgameCard[];
  cursor: number;
  updatedAt: number;
};

export type TablebaseMove = {
  uci: string;
  san: string;
  category: string;
  dtm: number | null;
  dtz: number | null;
};

export type TablebaseResponse = {
  category: string;
  dtm: number | null;
  dtz: number | null;
  moves: TablebaseMove[];
};

export type PipelineStatus =
  | "idle"
  | "generate"
  | "legal"
  | "analyze"
  | "store";

export type GameOverReason =
  | "checkmate"
  | "stalemate"
  | "insufficient"
  | "threefold";

export type ConfirmRequest = {
  title: string;
  body: string;
  confirmLabel?: string;
  run: () => void;
};
