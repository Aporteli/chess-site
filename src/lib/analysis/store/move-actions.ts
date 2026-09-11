import type { StateCreator } from 'zustand';

import type { AnalysisStore, MoveActions } from './analysis-types';

export const createMoveActions: StateCreator<AnalysisStore, [], [], MoveActions> = (set, get) => ({
  movePiece: (from: string, to: string) => {
    const { game } = get();

    try {
      const move = game.move({
        from,
        to,
        promotion: 'q',
      });

      if (!move) {
        return {
          ok: false,
        };
      }

      const nextFen = game.fen();

      set((state) => ({
        fen: nextFen,

        history: [...state.history, move.san],

        undoneMoves: [],

        arrows: [],

        revision: state.revision + 1,
      }));

      return {
        ok: true,
        fen: nextFen,
      };
    } catch {
      return {
        ok: false,
      };
    }
  },

  undo: () => {
    const { game } = get();

    try {
      const undoneMove = game.undo();

      if (!undoneMove) {
        return null;
      }

      const previousFen = game.fen();

      set((state) => ({
        fen: previousFen,

        history: state.history.slice(0, -1),

        undoneMoves: [...state.undoneMoves, undoneMove.san],

        arrows: [],

        revision: state.revision + 1,
      }));

      return undoneMove.san;
    } catch {
      return null;
    }
  },

  redo: () => {
    const { game, undoneMoves } = get();

    if (undoneMoves.length === 0) {
      return null;
    }

    const san = undoneMoves[undoneMoves.length - 1];

    try {
      const move = game.move(san);

      if (!move) {
        return null;
      }

      const nextFen = game.fen();

      set((state) => ({
        fen: nextFen,

        history: [...state.history, move.san],

        undoneMoves: state.undoneMoves.slice(0, -1),

        arrows: [],

        revision: state.revision + 1,
      }));

      return move.san;
    } catch {
      return null;
    }
  },
});