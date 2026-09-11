import type { StateCreator } from 'zustand';

import { createChessGame } from '../chess-game';
import { playUciMove } from '../chess-moves';

import type { AnalysisStore, PositionActions } from './analysis-types';

export const createPositionActions: StateCreator<AnalysisStore, [], [], PositionActions> = (set, get) => ({
  loadPosition: (fen: string) => {
    try {
      const game = createChessGame(fen);
      const nextFen = game.fen();

      set((state) => ({
        game,
        fen: nextFen,

        history: [],
        undoneMoves: [],

        arrows: [],

        startFen: nextFen,

        revision: state.revision + 1,
      }));

      return true;
    } catch {
      return false;
    }
  },

  reset: () => {
    const game = createChessGame();
    const fen = game.fen();

    set((state) => ({
      game,

      fen,

      history: [],

      undoneMoves: [],

      arrows: [],

      startFen: fen,

      revision: state.revision + 1,
    }));

    return fen;
  },

  playUciMoves: (moves: string[]) => {
    const { game } = get();

    try {
      const playedSan: string[] = [];

      for (const uci of moves) {
        const move = playUciMove(game, uci);

        if (!move) {
          return null;
        }

        playedSan.push(move.san);
      }

      const lastFen = game.fen();

      set((state) => ({
        fen: lastFen,

        history: [...state.history, ...playedSan],

        undoneMoves: [],

        arrows: [],

        revision: state.revision + 1,
      }));

      return lastFen;
    } catch {
      return null;
    }
  },
  toggleTurn: () => {
    const { fen } = get();

    const parts = fen.trim().split(/\s+/);
    if (parts.length < 2) return;

    parts[1] = parts[1] === "w" ? "b" : "w";
    if (parts.length >= 4) parts[3] = "-";

    try {
      const game = createChessGame(parts.join(" "));
      const nextFen = game.fen();

      set((state) => ({
        game,
        fen: nextFen,
        history: [],
        undoneMoves: [],
        arrows: [],
        startFen: nextFen,
        revision: state.revision + 1,
      }));
    } catch {
      // ignore invalid FEN produced when flipping the turn
    }
  },

});