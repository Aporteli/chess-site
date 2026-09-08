import type { StateCreator } from 'zustand';
import type { Arrow } from 'react-chessboard';
import type {
  BoardSettings,
  Chapter,
  DrillFilter,
  OpeningStore,
  Repertoire,
  TrainerMode,
  TreeNode,
} from '@/lib/chess';
import type { MoveStatus, Side } from '@/lib/types';
import type { DrillSession, PendingPromo, Premove } from '../types';

/** Everything that is plain, persisted-or-derivable state — no methods. */
export interface TrainerRawState {
  ready: boolean;
  store: OpeningStore;
  repId: string;
  chapterId: string;
  path: string[];
  mode: TrainerMode;
  flipped: boolean;
  selectedSquare: string | null;
  moveStatus: MoveStatus;
  arrows: Arrow[];
  userHighlights: Record<string, string>;
  promotion: PendingPromo | null;
  premove: Premove | null;
  settings: BoardSettings;
  drill: DrillSession | null;
  filter: DrillFilter;
}

export interface CoreActions {
  setStore: (updater: OpeningStore | ((prev: OpeningStore) => OpeningStore)) => void;
  setRepId: (id: string) => void;
  setChapterId: (id: string) => void;
  setPath: (path: string[]) => void;
  setFlipped: (v: boolean) => void;
  setSelectedSquare: (square: string | null) => void;
  setModeRaw: (mode: TrainerMode) => void;
  setArrows: (arrows: Arrow[]) => void;
  setUserHighlights: (
    updater: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
  setPromotion: (p: PendingPromo | null) => void;
  setPremove: (p: Premove | null) => void;
  setDrill: (updater: DrillSession | null | ((prev: DrillSession | null) => DrillSession | null)) => void;
  setFilter: (filter: DrillFilter) => void;
  /** Replaces one chapter inside the active repertoire, optionally moving the cursor. */
  updateChapter: (next: Chapter, nextPath?: string[]) => void;
}

export interface StatusActions {
  /** Flashes moveStatus (e.g. "correct"/"mistake") for ~900ms then resets it. */
  flashStatus: (status: MoveStatus) => void;
}

export interface HydrationActions {
  /** Loads persisted store/session/settings from storage once, on startup. */
  hydrate: () => void;
  /** Persists store + session after every change (debounced for the big store write). */
  persist: () => void;
}

export interface NavigationActions {
  selectRepertoire: (id: string) => void;
  selectChapter: (id: string) => void;
  openLocation: (chapterId: string, nodeId: string) => void;
  goToNode: (id: string) => void;
  goStart: () => void;
  goEnd: () => void;
  goBack: () => void;
  goForward: () => void;
}

export interface MoveActions {
  playUserMove: (from: string, to: string, promotion?: string) => boolean;
  completePromotion: (piece: 'q' | 'r' | 'b' | 'n') => void;
  cancelPromotion: () => void;
}

export interface DrillActions {
  startPractice: (target?: Chapter) => void;
  scheduleOpponent: (fromNodeId: string, session: DrillSession) => void;
  finishPractice: (session: DrillSession, visited: string[]) => void;
  requestHint: () => void;
  revealSolution: () => void;
  nextLine: () => void;
}

export interface EditingActions {
  updateCurrent: (patch: Partial<Pick<TreeNode, 'comment' | 'annotation' | 'nags' | 'eval' | 'weight'>>) => void;
  deleteCurrent: () => void;
  promoteCurrent: () => void;
}

export interface ImportExportActions {
  importPgnText: (pgn: string, asNewChapter?: boolean) => { ok: boolean; message: string };
  exportActiveChapter: () => string;
  exportActiveRepertoire: () => string;
}

export interface LibraryActions {
  createChapter: (name: string) => void;
  createRepertoire: (name: string, side: Side) => void;
  deleteChapter: (id: string) => void;
  deleteRepertoire: (id: string) => void;
  resetToSeed: () => void;
  loadCustomFen: (fen: string, name?: string) => boolean;
}

export interface BoardMarksActions {
  selectSquare: (square: string | null) => void;
  toggleHighlight: (square: string) => void;
  clearMarks: () => void;
  flipBoard: () => void;
  restartLine: () => void;
}

export interface SettingsActions {
  setSettings: (patch: Partial<BoardSettings>) => void;
  setMode: (mode: TrainerMode) => void;
}

export type TrainerState = TrainerRawState &
  CoreActions &
  StatusActions &
  HydrationActions &
  NavigationActions &
  MoveActions &
  DrillActions &
  EditingActions &
  ImportExportActions &
  LibraryActions &
  BoardMarksActions &
  SettingsActions;

/** Shorthand for a Zustand slice creator scoped to the combined store. */
export type TrainerSlice<T> = StateCreator<TrainerState, [], [], T>;
