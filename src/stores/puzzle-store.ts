import { create } from "zustand";
import { Chess } from "chess.js";
import { PuzzleData } from "@/lib/puzzles/api";
import { playSfx, sfxForMove } from "@/lib/chess/sounds";
import { applyUci, lineIndex } from "@/lib/utils";

type PuzzleState = {
  // Data
  puzzle: PuzzleData | null;
  boardFen: string | null;
  ply: number;
  hintLevel: number;
  status: string | null;
  sanHistory: string[];
  // UI
  sound: boolean;
  flipped: boolean;
  // Loading / error
  loading: boolean;
  error: string | null;

  // Actions
  setPuzzle: (puzzle: PuzzleData) => void;
  setBoardFen: (fen: string) => void;
  resetPuzzle: () => void;
  setHintLevel: (level: number) => void;
  setStatus: (status: string | null) => void;
  setSound: (enabled: boolean) => void;
  toggleFlipped: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  makeMove: (from: string, to: string, soundEnabled: boolean) => boolean;
};

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  puzzle: null,
  boardFen: null,
  ply: 0,
  hintLevel: 0,
  status: null,
  sanHistory: [],
  sound: true,
  flipped: false,
  loading: false,
  error: null,

  setPuzzle: (puzzle) =>
    set({
      puzzle,
      boardFen: puzzle.fen,
      ply: 0,
      hintLevel: 0,
      status: null,
      sanHistory: [],
    }),

  setBoardFen: (fen) => set({ boardFen: fen }),

  resetPuzzle: () => {
    const { puzzle } = get();
    if (!puzzle) return;
    set({
      boardFen: puzzle.fen,
      ply: 0,
      hintLevel: 0,
      status: null,
      sanHistory: [],
    });
  },

  setHintLevel: (level) => set({ hintLevel: Math.min(2, Math.max(0, level)) }),

  setStatus: (status) => set({ status }),

  setSound: (enabled) => set({ sound: enabled }),

  toggleFlipped: () => set((state) => ({ flipped: !state.flipped })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  makeMove: (from, to, soundEnabled) => {
    const state = get();
    const { puzzle, boardFen, sanHistory, ply } = state;
    if (!puzzle || !boardFen) return false;

    const game = new Chess(boardFen);
    const idx = lineIndex(puzzle.fen, boardFen, puzzle.solution);
    const expected =
      idx >= 0
        ? puzzle.solution[idx]?.toLowerCase()
        : puzzle.solution[ply]?.toLowerCase();

    const piece = game.get(from as any);
    const needsPromo =
      piece?.type === "p" &&
      ((piece.color === "w" && to[1] === "8") ||
        (piece.color === "b" && to[1] === "1"));

    let move;
    try {
      move = game.move({
        from,
        to,
        ...(needsPromo ? { promotion: expected?.[4] ?? "q" } : {}),
      });
    } catch {
      playSfx("error", soundEnabled);
      return false;
    }
    if (!move) {
      playSfx("error", soundEnabled);
      return false;
    }

    // Play sound
    const sfxConfig = sfxForMove({
      capture: move.captured !== undefined,
      castle: move.flags.includes("k") ? "k" : move.flags.includes("q") ? "q" : null,
      check: game.inCheck(),
      mate: game.isCheckmate(),
      promotion: move.promotion !== undefined,
    });
    playSfx(sfxConfig, soundEnabled);

    const nextSanHistory = [...sanHistory, move.san];
    const played = `${from}${to}${move.promotion ?? ""}`.toLowerCase();

    let nextPly = (idx >= 0 ? idx : ply) + 1;
    let newStatus: string | null = null;

    if (expected && played === expected) {
      if (nextPly < puzzle.solution.length) {
        try {
          const reply = applyUci(game, puzzle.solution[nextPly]);
          if (reply) {
            const replySfx = sfxForMove({
              capture: reply.captured !== undefined,
              castle: reply.flags.includes("k") ? "k" : reply.flags.includes("q") ? "q" : null,
              check: game.inCheck(),
              mate: game.isCheckmate(),
              promotion: reply.promotion !== undefined,
            });
            playSfx(replySfx, soundEnabled);
            nextSanHistory.push(reply.san);
          }
          nextPly += 1;
        } catch {
          playSfx("error", soundEnabled);
          return false;
        }
      }
      newStatus = nextPly >= puzzle.solution.length ? "Solved" : "Good";
      if (newStatus === "Solved") playSfx("success", soundEnabled);
    } else {
      newStatus = expected ? "Off the solution line" : null;
    }

    set({
      boardFen: game.fen(),
      ply: nextPly,
      hintLevel: 0,
      status: newStatus,
      sanHistory: nextSanHistory,
    });
    return true;
  },
}));