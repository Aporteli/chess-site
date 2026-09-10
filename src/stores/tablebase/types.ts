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
  undoneUcis: string[];
  startFen: string;
  hintUci: string | null;
  gameOver: GameOverReason | null;
  deck: EndgameDeck;
  activeCard: EndgameCard | null;
  pipeline: PipelineStatus;
  engineEnabled: boolean;
  localLines: EngineLine[];
};

export type TablebaseActions = {
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
  undo: () => void;
  redo: () => void;
};
