import { Chess } from "chess.js";
import { create } from "zustand";
import { ENDGAMES, START_FEN } from "@/lib/tablebase/chess/catalog";
import type {
  ConfirmRequest,
  EndgameCard,
  EndgameDeck,
  EndgameEntry,
  EngineLine,
  GameOverReason,
  PipelineStatus,
  TablebaseResponse,
} from "@/lib/tablebase/chess/types";
import { haltEngine, runtime } from "./runtime";

export type TablebaseState = {
  endgameQuery: string;
  endgameIndex: number;
  catalog: EndgameEntry[];
  isUploadOpen: boolean;
  confirm: ConfirmRequest | null;
  fen: string;
  fenInput: string;
  fenValid: boolean;
  flipped: boolean;
  sound: boolean;
  result: TablebaseResponse | null;
  resultFen: string | null;
  loading: boolean;
  error: string | null;
  uciHistory: string[];
  hintUci: string | null;
  gameOver: GameOverReason | null;
  deck: EndgameDeck;
  activeCard: EndgameCard | null;
  pipeline: PipelineStatus;
  engineEnabled: boolean;
  localLines: EngineLine[];
};

type Actions = {
  setQuery: (q: string) => void;
  setIndex: (i: number) => void;
  setCatalog: (c: EndgameEntry[]) => void;
  setUploadOpen: (open: boolean) => void;
  setConfirm: (c: ConfirmRequest | null) => void;
  toggleFlip: () => void;
  toggleSound: () => void;
  toggleEngine: () => void;
  setHintUci: (uci: string | null) => void;
  setError: (error: string | null) => void;
  setPipeline: (pipeline: PipelineStatus) => void;
  setDeck: (deck: EndgameDeck) => void;
  setActiveCard: (card: EndgameCard | null) => void;
  setResult: (result: TablebaseResponse | null, fen?: string | null) => void;
  setLoading: (loading: boolean) => void;
  setLocalLines: (lines: EngineLine[]) => void;
  commitFen: (nextFen: string) => boolean;
  applyPlayedFen: (nextFen: string, uci: string) => void;
  applyFenInput: (value: string) => void;
};

const initial: TablebaseState = {
  endgameQuery: "",
  endgameIndex: 0,
  catalog: ENDGAMES,
  isUploadOpen: false,
  confirm: null,
  fen: START_FEN,
  fenInput: START_FEN,
  fenValid: true,
  flipped: false,
  sound: true,
  result: null,
  resultFen: null,
  loading: false,
  error: null,
  uciHistory: [],
  hintUci: null,
  gameOver: null,
  deck: {
    id: "deck",
    name: "Endgame deck",
    cards: [],
    cursor: 0,
    updatedAt: 0,
  },
  activeCard: null,
  pipeline: "idle",
  engineEnabled: true,
  localLines: [],
};

export const useTablebaseStore = create<TablebaseState & Actions>()(
  (set, get) => ({
    ...initial,
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
  }),
);

export function selectedKindOf(s: TablebaseState): string {
  return s.catalog[s.endgameIndex]?.id ?? s.catalog[0]?.id ?? ENDGAMES[0]!.id;
}

export function typedCardsOf(s: TablebaseState) {
  const kind = selectedKindOf(s);
  return s.deck.cards.filter((c) => c.kind === kind);
}

export function humanColorOf(s: TablebaseState): "w" | "b" {
  return s.flipped ? "b" : "w";
}
