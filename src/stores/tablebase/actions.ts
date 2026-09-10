import { Chess } from "chess.js";
import { endReason, replayUcis } from "@/lib/tablebase/chess/moves";
import { haltEngine, runtime } from "@/stores/runtime";
import type { TablebaseState, TablebaseActions } from "./types";

export function createTablebaseSlice(
  set: (partial: Partial<TablebaseState> | ((state: TablebaseState) => Partial<TablebaseState>)) => void,
  get: () => TablebaseState & TablebaseActions
): TablebaseActions {
  return {
    setQuery: (endgameQuery) => set({ endgameQuery }),
    setIndex: (endgameIndex) => set({ endgameIndex }),
    setCatalog: (catalog) => set({ catalog }),
    setUploadOpen: (isUploadOpen) => set({ isUploadOpen }),
    setConfirm: (confirm) => set({ confirm }),
    toggleFlip: () => set({ flipped: !get().flipped }),
    toggleSound: () => set({ sound: !get().sound }),
    toggleEngine: () => set({ engineEnabled: !get().engineEnabled }),
    setHintUci: (hintUci) => set({ hintUci }),
    setError: (error) => set({ error }),
    setPipeline: (pipeline) => set({ pipeline }),
    setDeck: (deck) => set({ deck }),
    setActiveCard: (activeCard) => set({ activeCard }),
    setResult: (result, fen) =>
      set({ result, resultFen: result ? (fen ?? get().fen) : null }),
    setLoading: (loading) => set({ loading }),
    setLocalLines: (localLines) => set({ localLines }),
    commitFen: (nextFen) => {
      try {
        const next = new Chess(nextFen);
        runtime.replyFen = null;
        runtime.repliedFen = null;
        set({
          fen: next.fen(),
          fenInput: next.fen(),
          fenValid: true,
          uciHistory: [],
          undoneUcis: [],
          startFen: next.fen(),
          gameOver: null,
          result: null,
          resultFen: null,
          hintUci: null,
          error: null,
          localLines: [],
        });
        return true;
      } catch {
        set({ fenValid: false });
        return false;
      }
    },
    applyPlayedFen: (nextFen, uci) =>
      set((s) => ({
        fen: nextFen,
        fenInput: nextFen,
        fenValid: true,
        uciHistory: [...s.uciHistory, uci],
        undoneUcis: [],
        result: null,
        resultFen: null,
        hintUci: null,
        localLines: [],
      })),
    applyFenInput: (value) => {
      set({ fenInput: value, activeCard: null });
      if (!get().commitFen(value)) return;
      haltEngine();
    },
    undo: () => {
      const s = get();
      if (s.pipeline !== "idle" || s.uciHistory.length === 0) return;
      const uci = s.uciHistory[s.uciHistory.length - 1];
      const prevFen = replayUcis(s.startFen, s.uciHistory.slice(0, -1));
      if (!prevFen) return;
      haltEngine();
      set({
        fen: prevFen,
        fenInput: prevFen,
        fenValid: true,
        uciHistory: s.uciHistory.slice(0, -1),
        undoneUcis: [...s.undoneUcis, uci],
        gameOver: null,
        result: null,
        resultFen: null,
        hintUci: null,
        localLines: [],
      });
    },
    redo: () => {
      const s = get();
      if (s.pipeline !== "idle" || s.undoneUcis.length === 0) return;
      const uci = s.undoneUcis[s.undoneUcis.length - 1];
      const nextHistory = [...s.uciHistory, uci];
      const nextFen = replayUcis(s.startFen, nextHistory);
      if (!nextFen) return;
      haltEngine();
      const game = new Chess(nextFen);
      set({
        fen: nextFen,
        fenInput: nextFen,
        fenValid: true,
        uciHistory: nextHistory,
        undoneUcis: s.undoneUcis.slice(0, -1),
        gameOver: endReason(game),
        result: null,
        resultFen: null,
        hintUci: null,
        localLines: [],
      });
    },
  };
}
