import { create } from "zustand";
import { Chess } from "chess.js";
import type { Arrow } from "react-chessboard";

export type SaveState = "idle" | "saving" | "saved" | "error";

type AnalysisStore = {
  game: Chess;
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

  toggleSound: () => void;
  toggleBoard: () => void;
  setArrows: (arrows: Arrow[]) => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  setSaveState: (state: SaveState, message?: string) => void;

  loadPosition: (fen: string) => boolean;
  movePiece: (from: string, to: string) => { ok: boolean; fen?: string };
  undo: () => string | null;
  redo: () => string | null;
  reset: () => string;
  playUciMoves: (moves: string[]) => string | null;
};

const createGame = (fen?: string) => new Chess(fen);

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  game: createGame(),
  fen: createGame().fen(),
  history: [],
  undoneMoves: [],
  flipped: false,
  sound: true,
  arrows: [],
  isUploadBoardOpen: false,
  startFen: createGame().fen(),
  saveState: "idle",
  saveMessage: "",
  revision: 0,

  toggleSound: () => set((state) => ({ sound: !state.sound })),
  toggleBoard: () => set((state) => ({ flipped: !state.flipped })),
  setArrows: (arrows) => set({ arrows }),
  openUploadModal: () => set({ isUploadBoardOpen: true }),
  closeUploadModal: () => set({ isUploadBoardOpen: false }),

  setSaveState: (saveState, saveMessage = "") =>
    set({ saveState, saveMessage }),

  loadPosition: (fen) => {
    try {
      const game = createGame(fen);
      set({
        game,
        fen: game.fen(),
        history: [],
        undoneMoves: [],
        arrows: [],
        startFen: game.fen(),
        revision: get().revision + 1,
      });
      return true;
    } catch {
      return false;
    }
  },

  movePiece: (from, to) => {
    const { game, sound } = get();

    try {
      const move = game.move({ from, to, promotion: "q" });
      if (!move) return { ok: false };

      const nextFen = game.fen();
      set({
        fen: nextFen,
        history: [...get().history, move.san],
        undoneMoves: [],
        arrows: [],
        revision: get().revision + 1,
      });

      return { ok: true, fen: nextFen };
    } catch {
      return { ok: false };
    }
  },

  undo: () => {
    const { game, history } = get();
    const undoneMove = game.undo();
    if (!undoneMove) return null;

    const prevFen = game.fen();
    set({
      fen: prevFen,
      undoneMoves: [...get().undoneMoves, undoneMove.san],
      history: history.slice(0, -1),
      arrows: [],
      revision: get().revision + 1,
    });

    return undoneMove.san;
  },

  redo: () => {
    const { game, undoneMoves } = get();
    if (!undoneMoves.length) return null;

    const san = undoneMoves[undoneMoves.length - 1];
    const move = game.move(san);
    if (!move) return null;

    const nextFen = game.fen();
    set({
      fen: nextFen,
      history: [...get().history, move.san],
      undoneMoves: undoneMoves.slice(0, -1),
      arrows: [],
      revision: get().revision + 1,
    });

    return move.san;
  },

  reset: () => {
    const game = createGame();
    const fen = game.fen();

    set({
      game,
      fen,
      history: [],
      undoneMoves: [],
      arrows: [],
      startFen: fen,
      revision: get().revision + 1,
    });

    return fen;
  },

  playUciMoves: (moves) => {
    const { game } = get();

    try {
      let lastFen = get().fen;
      const playedSan: string[] = [];

      for (const uci of moves) {
        const move = game.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          ...(uci[4] ? { promotion: uci[4] } : {}),
        });

        if (!move) return null;

        playedSan.push(move.san);
        lastFen = game.fen();
      }

      set({
        fen: lastFen,
        history: [...get().history, ...playedSan],
        undoneMoves: [],
        arrows: [],
        revision: get().revision + 1,
      });

      return lastFen;
    } catch {
      return null;
    }
  },
}));
