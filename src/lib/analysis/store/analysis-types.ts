import type { Arrow } from "react-chessboard";

export type SaveState = "idle" | "saving" | "saved" | "error";

export type AnalysisState = {
  game: import("chess.js").Chess;
  fen: string;
  history: string[];
  undoneMoves: string[];
  flipped: boolean;
  sound: boolean;
  arrows: Arrow[];
  isUploadBoardOpen: boolean;
  startFen: string;
  saveState: SaveState;
  saveMessage: string;
  revision: number;
};

export type UiActions = {
  toggleSound: () => void;
  toggleBoard: () => void;

  setArrows: (arrows: Arrow[]) => void;

  openUploadModal: () => void;
  closeUploadModal: () => void;

  setSaveState: (
    state: SaveState,
    message?: string,
  ) => void;
};

export type PositionActions = {
  loadPosition: (fen: string) => boolean;
  toggleTurn: () => void;

  reset: () => string;

  playUciMoves: (
    moves: string[],
  ) => string | null;
};

export type MoveActions = {
  movePiece: (
    from: string,
    to: string,
  ) => {
    ok: boolean;
    fen?: string;
  };

  undo: () => string | null;
  redo: () => string | null;
};

export type AnalysisActions =
  UiActions & PositionActions & MoveActions;

export type AnalysisStore =
  AnalysisState & AnalysisActions;