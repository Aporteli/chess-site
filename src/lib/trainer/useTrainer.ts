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
import type { Side } from '@/lib/types';
import type { MoveStatus, OpeningMeta, SrsState, TrainerPrompt } from '@/lib/types';
import { useTrainerStore } from './store';
import { useActiveEntities } from './selectors/useActiveEntities';
import { useTranspositions } from './selectors/useTranspositions';
import { useDueCounts } from './selectors/useDueCounts';
import { useOpeningMeta } from './selectors/useOpeningMeta';
import { useSrsState } from './selectors/useSrsState';
import { useHintSquares } from './selectors/useHintSquares';
import { usePrompt } from './selectors/usePrompt';
import { useLastMove, useMasterReference, useLegalTargets, useCheckSquare } from './selectors/useBoardDerived';
import type { DrillSession, PendingPromo, Premove, TranspositionHit } from './types';

export interface TrainerContextValue {
  ready: boolean;
  store: OpeningStore;
  repertoire: Repertoire;
  chapter: Chapter;
  node: TreeNode;
  path: string[];
  fen: string;
  mode: TrainerMode;
  flipped: boolean;
  selectedSquare: string | null;
  lastMove: { from: string; to: string } | null;
  moveStatus: MoveStatus;
  arrows: Arrow[];
  userHighlights: Record<string, string>;
  promotion: PendingPromo | null;
  premove: Premove | null;
  settings: BoardSettings;
  drill: DrillSession | null;
  hintSquares: { from?: string; to?: string };
  openingMeta: OpeningMeta;
  srsState: SrsState;
  prompt: TrainerPrompt;
  transpositions: TranspositionHit[];
  master: ReturnType<typeof useMasterReference>;
  legalTargets: string[];
  checkSquare: string | null;
  due: ReturnType<typeof useDueCounts>;
  setSettings: (patch: Partial<BoardSettings>) => void;
  setMode: (mode: TrainerMode) => void;
  startPractice: () => void;
  setFilter: (filter: DrillFilter) => void;
  selectRepertoire: (id: string) => void;
  selectChapter: (id: string) => void;
  openLocation: (chapterId: string, nodeId: string) => void;
  goToNode: (id: string) => void;
  goStart: () => void;
  goEnd: () => void;
  goBack: () => void;
  goForward: () => void;
  flipBoard: () => void;
  restartLine: () => void;
  selectSquare: (square: string | null) => void;
  playUserMove: (from: string, to: string, promotion?: string) => boolean;
  completePromotion: (piece: 'q' | 'r' | 'b' | 'n') => void;
  cancelPromotion: () => void;
  requestHint: () => void;
  revealSolution: () => void;
  nextLine: () => void;
  updateCurrent: (patch: Partial<Pick<TreeNode, 'comment' | 'annotation' | 'nags' | 'eval' | 'weight'>>) => void;
  deleteCurrent: () => void;
  promoteCurrent: () => void;
  importPgnText: (pgn: string, asNewChapter?: boolean) => { ok: boolean; message: string };
  exportActiveChapter: () => string;
  exportActiveRepertoire: () => string;
  createChapter: (name: string) => void;
  createRepertoire: (name: string, side: Side) => void;
  deleteChapter: (id: string) => void;
  deleteRepertoire: (id: string) => void;
  resetToSeed: () => void;
  setArrows: (arrows: Arrow[]) => void;
  toggleHighlight: (square: string) => void;
  clearMarks: () => void;
  loadCustomFen: (fen: string, name?: string) => boolean;
}

export function useTrainerValue(): TrainerContextValue | null {
  const state = useTrainerStore();
  const { repertoire, chapter, node, fen } = useActiveEntities();

  const due = useDueCounts(repertoire, chapter);
  const openingMeta = useOpeningMeta(repertoire, chapter);
  const srsState = useSrsState(node, chapter, state.drill);
  const hintSquares = useHintSquares(state.mode, state.drill, chapter, node);
  const prompt = usePrompt(repertoire, node, state.mode, chapter, state.drill);
  const transpositions = useTranspositions({ repertoire, chapter, node, fen });
  const lastMove = useLastMove(node);
  const master = useMasterReference(fen);
  const legalTargets = useLegalTargets(state.selectedSquare, node);
  const checkSquare = useCheckSquare(fen);

  if (!state.ready || !repertoire || !chapter || !node) return null;

  return {
    ready: state.ready,
    store: state.store,
    repertoire,
    chapter,
    node,
    path: state.path,
    fen,
    mode: state.mode,
    flipped: state.flipped,
    selectedSquare: state.selectedSquare,
    lastMove,
    moveStatus: state.moveStatus,
    arrows: state.arrows,
    userHighlights: state.userHighlights,
    promotion: state.promotion,
    premove: state.premove,
    settings: state.settings,
    drill: state.drill,
    hintSquares,
    openingMeta,
    srsState,
    prompt,
    transpositions,
    master,
    legalTargets,
    checkSquare,
    due,
    setSettings: state.setSettings,
    setMode: state.setMode,
    startPractice: () => state.startPractice(),
    setFilter: state.setFilter,
    selectRepertoire: state.selectRepertoire,
    selectChapter: state.selectChapter,
    openLocation: state.openLocation,
    goToNode: state.goToNode,
    goStart: state.goStart,
    goEnd: state.goEnd,
    goBack: state.goBack,
    goForward: state.goForward,
    flipBoard: state.flipBoard,
    restartLine: state.restartLine,
    selectSquare: state.selectSquare,
    playUserMove: state.playUserMove,
    completePromotion: state.completePromotion,
    cancelPromotion: state.cancelPromotion,
    requestHint: state.requestHint,
    revealSolution: state.revealSolution,
    nextLine: state.nextLine,
    updateCurrent: state.updateCurrent,
    deleteCurrent: state.deleteCurrent,
    promoteCurrent: state.promoteCurrent,
    importPgnText: state.importPgnText,
    exportActiveChapter: state.exportActiveChapter,
    exportActiveRepertoire: state.exportActiveRepertoire,
    createChapter: state.createChapter,
    createRepertoire: state.createRepertoire,
    deleteChapter: state.deleteChapter,
    deleteRepertoire: state.deleteRepertoire,
    resetToSeed: state.resetToSeed,
    setArrows: state.setArrows,
    toggleHighlight: state.toggleHighlight,
    clearMarks: state.clearMarks,
    loadCustomFen: state.loadCustomFen,
  };
}

/** Throws if used before the trainer is ready — pair with <TrainerGate>. */
export function useTrainer(): TrainerContextValue {
  const value = useTrainerValue();
  if (!value) {
    throw new Error('useTrainer must be used within <TrainerGate> after load');
  }
  return value;
}
