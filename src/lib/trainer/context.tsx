'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Arrow } from 'react-chessboard';
import {
  addSanMove,
  deleteSubtree,
  dueCounts,
  emptyChapter,
  exportChapterPgn,
  exportRepertoirePgn,
  findInRepertoire,
  findTranspositions,
  formatLine,
  getNode,
  gradeFromAttempt,
  importPgn,
  inCheck,
  isOurTurn,
  isTrainable,
  legalMovesFrom,
  loadSession,
  loadSettings,
  loadStore,
  saveSession,
  lookupMaster,
  mainlineChild,
  needsPromotion,
  pathSans,
  nextLineNode,
  pathToNode,
  patchNode,
  pickOpponentReply,
  pickTrainingLine,
  playMove,
  playSfx,
  promoteMainline,
  randomChild,
  replaceChapter,
  replaceRepertoire,
  resetStore,
  reviewCard,
  saveSettings,
  saveStore,
  sfxForMove,
  srsLevel,
  uid,
  type BoardSettings,
  type Chapter,
  type DrillCard,
  type DrillFilter,
  type OpeningStore,
  type Repertoire,
  type TrainerMode,
  type TreeNode,
} from '@/lib/chess';
import type { MoveStatus, OpeningMeta, SrsState, TrainerPrompt, Side } from '@/lib/types';

export interface DrillSession {
  filter: DrillFilter;
  queue: DrillCard[];
  index: number;
  mistakes: number;
  hintLevel: number;
  usedSolution: boolean;
  awaitingRetry: boolean;
  lineComplete: boolean;
  startedAt: number;
  reviewed: number;
  correctLines: number;
  opponentThinking: boolean;
  sessionOver: boolean;
  /** Node ids from the current position's ancestor root to a leaf. */
  line: string[];
}

interface PendingPromo {
  from: string;
  to: string;
}

export interface TranspositionHit {
  chapterName: string;
  line: string;
  nodeId: string;
  chapterId: string;
}

interface TrainerContextValue {
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
  premove: { from: string; to: string; promotion?: string } | null;
  settings: BoardSettings;
  drill: DrillSession | null;
  hintSquares: { from?: string; to?: string };
  openingMeta: OpeningMeta;
  srsState: SrsState;
  prompt: TrainerPrompt;
  transpositions: TranspositionHit[];
  master: ReturnType<typeof lookupMaster>;
  legalTargets: string[];
  checkSquare: string | null;
  due: ReturnType<typeof dueCounts>;
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
}

const TrainerContext = createContext<TrainerContextValue | null>(null);

function emptyDrill(filter: DrillFilter): DrillSession {
  return {
    filter,
    queue: [],
    index: 0,
    mistakes: 0,
    hintLevel: 0,
    usedSolution: false,
    awaitingRetry: false,
    lineComplete: false,
    startedAt: Date.now(),
    reviewed: 0,
    correctLines: 0,
    opponentThinking: false,
    sessionOver: false,
    line: [],
  };
}

export function TrainerProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<OpeningStore>({ version: 1, repertoires: [] });
  const [repId, setRepId] = useState<string>('');
  const [chapterId, setChapterId] = useState<string>('');
  const [path, setPath] = useState<string[]>([]);
  const [mode, setModeState] = useState<TrainerMode>('study');
  const [flipped, setFlipped] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [moveStatus, setMoveStatus] = useState<MoveStatus>('pending');
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [userHighlights, setUserHighlights] = useState<Record<string, string>>({});
  const [promotion, setPromotion] = useState<PendingPromo | null>(null);
  const [premove, setPremoveState] = useState<{ from: string; to: string; promotion?: string } | null>(null);
  const [settings, setSettingsState] = useState<BoardSettings>(loadSettings());
  const [drill, setDrill] = useState<DrillSession | null>(null);
  const [, setFilterState] = useState<DrillFilter>('due');

  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const premoveRef = useRef<{ from: string; to: string; promotion?: string } | null>(null);
  const chapterRef = useRef<Chapter | undefined>(undefined);
  const repertoireRef = useRef<Repertoire | undefined>(undefined);
  const pathRef = useRef<string[]>([]);
  const nodeRef = useRef<TreeNode | undefined>(undefined);
  const scheduleRef = useRef<(fromNodeId: string, session: DrillSession) => void>(() => {});
  const lastLineLeafRef = useRef<string | null>(null);
  const setPremove = useCallback((next: { from: string; to: string; promotion?: string } | null) => {
    premoveRef.current = next;
    setPremoveState(next);
  }, []);

  const repertoire = store.repertoires.find((r) => r.id === repId) ?? store.repertoires[0];
  const chapter = repertoire?.chapters.find((c) => c.id === chapterId) ?? repertoire?.chapters[0];
  const currentId = path[path.length - 1] ?? chapter?.rootId ?? '';
  const node = chapter && currentId ? chapter.nodes[currentId] : undefined;
  const fen = node?.fen ?? '8/8/8/8/8/8/8/8 w - - 0 1';

  useEffect(() => {
    chapterRef.current = chapter;
    repertoireRef.current = repertoire;
    pathRef.current = path;
    nodeRef.current = node;
  }, [chapter, repertoire, path, node]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate persisted study from localStorage */
    const loaded = loadStore();
    setStore(loaded);
    const session = loadSession();
    const first = loaded.repertoires.find((r) => r.id === session?.repertoireId) ?? loaded.repertoires[0];
    const firstCh = first?.chapters.find((c) => c.id === session?.chapterId) ?? first?.chapters[0];
    if (first && firstCh) {
      setRepId(first.id);
      setChapterId(firstCh.id);
      setPath([firstCh.rootId]);
      setFlipped(first.side === 'black');
    }
    setSettingsState(loadSettings());
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => saveStore(store), 250);
    if (repId && chapterId) saveSession({ repertoireId: repId, chapterId });
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [store, ready, repId, chapterId]);

  const updateChapter = useCallback(
    (next: Chapter, nextPath?: string[]) => {
      setStore((prev) => {
        const rep = prev.repertoires.find((r) => r.id === (repertoire?.id ?? ''));
        if (!rep) return prev;
        return {
          ...prev,
          repertoires: replaceRepertoire(prev.repertoires, replaceChapter(rep, next)),
        };
      });
      if (nextPath) setPath(nextPath);
    },
    [repertoire?.id],
  );

  const flashStatus = useCallback((status: MoveStatus) => {
    setMoveStatus(status);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setMoveStatus('pending'), 900);
  }, []);

  const applySrs = useCallback((ch: Chapter, nodeId: string, grade: Parameters<typeof reviewCard>[1]) => {
    const target = ch.nodes[nodeId];
    if (!target) return ch;
    return patchNode(ch, nodeId, { srs: reviewCard(target.srs, grade) });
  }, []);

  const finishPractice = useCallback(
    (session: DrillSession, visited: string[]) => {
      const ch = chapterRef.current;
      const rep = repertoireRef.current;
      if (!ch || !rep) {
        setDrill({ ...session, lineComplete: true, opponentThinking: false });
        return;
      }
      let nextCh = ch;
      const grade = gradeFromAttempt({
        mistakes: session.mistakes,
        hintLevel: session.hintLevel,
        usedSolution: session.usedSolution,
      });
      for (const id of visited) {
        const n = nextCh.nodes[id];
        if (n?.move && isTrainable(n, rep.side)) {
          nextCh = applySrs(nextCh, id, grade);
        }
      }
      const reviewed = session.reviewed + 1;
      const correctLines = session.correctLines + (grade === 'again' ? 0 : 1);
      setDrill({
        ...session,
        reviewed,
        correctLines,
        lineComplete: true,
        sessionOver: false,
        mistakes: 0,
        hintLevel: 0,
        usedSolution: false,
        awaitingRetry: false,
        opponentThinking: false,
      });
      lastLineLeafRef.current = visited[visited.length - 1] ?? null;
      if (nextCh !== ch) updateChapter(nextCh);
      flashStatus(grade === 'again' ? 'mistake' : 'correct');
    },
    [applySrs, flashStatus, updateChapter],
  );

  const scheduleOpponent = useCallback(
    (fromNodeId: string, session: DrillSession) => {
      const ch = chapterRef.current;
      const rep = repertoireRef.current;
      if (!ch || !rep) return;

      const nextMoveNode = pickOpponentReply(ch, fromNodeId, session.line);
      if (!nextMoveNode) {
        // No opponent replies at all — the user's last move was the end of the line.
        finishPractice(session, pathToNode(ch, fromNodeId));
        return;
      }

      setDrill({ ...session, opponentThinking: true, lineComplete: false });
      if (replyTimer.current) clearTimeout(replyTimer.current);
      replyTimer.current = setTimeout(() => {
        const latest = chapterRef.current ?? ch;
        const side = repertoireRef.current?.side ?? rep.side;
        const chosen = latest.nodes[nextMoveNode.id] ?? nextMoveNode;

        setPath(pathToNode(latest, chosen.id));
        playSfx(sfxForMove(chosen.move!.flags), settings.sound);
        setDrill((d) => (d ? { ...d, opponentThinking: false, lineComplete: false } : d));

        // Stay on this branch. End only at a real leaf — never just because
        // a variation was chosen. If it is our turn, wait for the next book move.
        if (chosen.children.length === 0) {
          finishPractice(session, pathToNode(latest, chosen.id));
          return;
        }
        if (!isOurTurn(chosen.fen, side)) {
          scheduleRef.current(chosen.id, session);
        }
      }, 300);
    },
    [finishPractice, settings.sound],
  );

  useEffect(() => {
    scheduleRef.current = scheduleOpponent;
  }, [scheduleOpponent]);

  const startPractice = useCallback(
    (target?: Chapter) => {
      const ch = target ?? chapter;
      if (!repertoire || !ch) return;
      if (replyTimer.current) clearTimeout(replyTimer.current);
      setModeState('drill');
      setChapterId(ch.id);
      setPath([ch.rootId]);
      setSelectedSquare(null);
      setMoveStatus('pending');
      setPremove(null);
      setArrows([]);
      setUserHighlights({});
      setPromotion(null);
      const card: DrillCard = {
        chapterId: ch.id,
        nodeId: ch.rootId,
        parentId: ch.rootId,
        reason: 'chapter',
      };
      const line = pickTrainingLine(ch, ch.rootId, lastLineLeafRef.current);
      lastLineLeafRef.current = line[line.length - 1] ?? null;
      const session: DrillSession = {
        ...emptyDrill("chapter"),
        queue: [card],
        sessionOver: false,
        lineComplete: false,
        opponentThinking: false,
        line: [],
      };
      setDrill(session);
      const root = getNode(ch, ch.rootId);
      if (!isOurTurn(root.fen, repertoire.side) && root.children.length > 0) {
        scheduleOpponent(root.id, session);
      }
    },
    [repertoire, chapter, scheduleOpponent, setPremove],
  );

  const setMode = useCallback(
    (next: TrainerMode) => {
      setModeState(next);
      setSelectedSquare(null);
      setMoveStatus('pending');
      setPremove(null);
      if (replyTimer.current) clearTimeout(replyTimer.current);
      if (next === 'drill') startPractice();
      else setDrill(null);
    },
    [startPractice, setPremove],
  );

  const setFilter = useCallback((next: DrillFilter) => {
    setFilterState(next);
  }, []);

  const selectRepertoire = useCallback(
    (id: string) => {
      const rep = store.repertoires.find((r) => r.id === id);
      if (!rep) return;
      setRepId(id);
      const ch = rep.chapters[0];
      if (ch) {
        setChapterId(ch.id);
        setPath([ch.rootId]);
        saveSession({ repertoireId: id, chapterId: ch.id });
      }
      setFlipped(rep.side === 'black');
      setModeState('study');
      setDrill(null);
    },
    [store.repertoires],
  );

  const selectChapter = useCallback(
    (id: string) => {
      const ch = repertoire?.chapters.find((c) => c.id === id);
      if (!ch) return;
      setChapterId(id);
      setPath([ch.rootId]);
      setSelectedSquare(null);
      if (repertoire) saveSession({ repertoireId: repertoire.id, chapterId: id });
      if (mode === 'drill') startPractice(ch);
    },
    [repertoire, mode, startPractice],
  );

  const openLocation = useCallback(
    (nextChapterId: string, nodeId: string) => {
      const ch = repertoire?.chapters.find((c) => c.id === nextChapterId);
      if (!ch || !ch.nodes[nodeId]) return;
      setChapterId(nextChapterId);
      setPath(pathToNode(ch, nodeId));
      setSelectedSquare(null);
    },
    [repertoire],
  );

  const goToNode = useCallback(
    (id: string) => {
      if (!chapter || !chapter.nodes[id]) return;
      setPath(pathToNode(chapter, id));
      setSelectedSquare(null);
    },
    [chapter],
  );

  const goStart = useCallback(() => {
    if (!chapter) return;
    setPath([chapter.rootId]);
  }, [chapter]);

  const goBack = useCallback(() => {
    if (path.length > 1) setPath(path.slice(0, -1));
  }, [path]);

  const goForward = useCallback(() => {
    if (!chapter || !node || !repertoire) return;
    if (mode === 'drill' && drill && !drill.lineComplete && !isOurTurn(node.fen, repertoire.side)) {
      scheduleOpponent(node.id, drill);
      return;
    }
    const child = mainlineChild(chapter, node.id) ?? randomChild(chapter, node.id);
    if (child) setPath(pathToNode(chapter, child.id));
  }, [chapter, node, mode, drill, repertoire, scheduleOpponent]);

  const goEnd = useCallback(() => {
    if (!chapter || !node) return;
    const next = [...path];
    let cursor = node;
    while (true) {
      const child = mainlineChild(chapter, cursor.id);
      if (!child) break;
      next.push(child.id);
      cursor = child;
    }
    setPath(next);
  }, [chapter, node, path]);

  const playUserMove = useCallback(
    (from: string, to: string, promotion?: string): boolean => {
      if (!chapter || !node || !repertoire) return false;

      if (needsPromotion(node.fen, from, to) && !promotion) {
        setPromotion({ from, to });
        return false;
      }

      if (mode === 'drill' && drill?.opponentThinking) {
        setPremove({ from, to, promotion });
        setSelectedSquare(null);
        return false;
      }

      let played;
      try {
        played = playMove(node.fen, from, to, promotion);
      } catch {
        return false;
      }

      const existing = node.children.map((id) => getNode(chapter, id)).find((c) => c.move?.san === played.san);

      if (mode === 'study') {
        playSfx(
          sfxForMove({
            capture: played.isCapture(),
            castle: played.isKingsideCastle() ? 'k' : played.isQueensideCastle() ? 'q' : null,
            check: played.san.includes('+') || played.san.includes('#'),
            mate: played.san.includes('#'),
            promotion: played.isPromotion(),
          }),
          settings.sound,
        );
        if (existing) {
          setPath([...path, existing.id]);
        } else {
          const added = addSanMove(chapter, node.id, played.san);
          updateChapter(added.chapter, [...path, added.node.id]);
        }
        setSelectedSquare(null);
        setPromotion(null);
        return true;
      }

      // Practice / drill — any book child is valid; opponent replies automatically.
      // Practice / drill — any book child is valid; opponent replies automatically.
      if (!drill || drill.lineComplete) return false;
      if (!isOurTurn(node.fen, repertoire.side)) return false;

      if (!existing) {
        playSfx('error', settings.sound);
        flashStatus('mistake');
        setDrill({
          ...drill,
          mistakes: drill.mistakes + 1,
          awaitingRetry: true,
        });
        setSelectedSquare(null);
        return false;
      }

      playSfx('success', settings.sound);
      flashStatus('correct');
      setPath(pathToNode(chapter, existing.id));
      setSelectedSquare(null);
      setPromotion(null);

      const nextSession: DrillSession = {
        ...drill,
        awaitingRetry: false,
      };
      setDrill(nextSession);

      // If no further moves exist in the repertoire for either side:
      if (existing.children.length === 0) {
        finishPractice(nextSession, pathToNode(chapter, existing.id));
      } else {
        // Automatically trigger opponent's reply
        scheduleOpponent(existing.id, nextSession);
      }
      return true;
    },
    [
      chapter,
      node,
      repertoire,
      mode,
      drill,
      path,
      settings.sound,
      setPremove,
      flashStatus,
      scheduleOpponent,
      finishPractice,
      updateChapter,
    ],
  );

  const completePromotion = useCallback(
    (piece: 'q' | 'r' | 'b' | 'n') => {
      if (!promotion) return;
      playUserMove(promotion.from, promotion.to, piece);
    },
    [promotion, playUserMove],
  );

  const requestHint = useCallback(() => {
    if (mode !== 'drill' || !drill || !chapter || !node) return;
    const expected =
      nextLineNode(chapter, drill.line, node.id) ?? mainlineChild(chapter, node.id) ?? randomChild(chapter, node.id);
    if (!expected?.move) return;
    setDrill({ ...drill, hintLevel: Math.min(3, drill.hintLevel + 1) });
  }, [mode, drill, chapter, node]);

  const revealSolution = useCallback(() => {
    if (mode !== 'drill' || !drill || !chapter || !node) return;
    const expected =
      nextLineNode(chapter, drill.line, node.id) ?? mainlineChild(chapter, node.id) ?? randomChild(chapter, node.id);
    if (!expected?.move) return;
    setDrill({ ...drill, usedSolution: true, hintLevel: 3 });
    playUserMove(expected.move.from, expected.move.to, expected.move.promotion);
  }, [mode, drill, chapter, node, playUserMove]);

  const nextLine = useCallback(() => {
    startPractice();
  }, [startPractice]);

  const updateCurrent = useCallback(
    (patch: Partial<Pick<TreeNode, 'comment' | 'annotation' | 'nags' | 'eval' | 'weight'>>) => {
      if (!chapter || !node) return;
      updateChapter(patchNode(chapter, node.id, patch));
    },
    [chapter, node, updateChapter],
  );

  const deleteCurrent = useCallback(() => {
    if (!chapter || !node?.parentId) return;
    const result = deleteSubtree(chapter, node.id);
    updateChapter(result.chapter, pathToNode(result.chapter, result.focusId));
  }, [chapter, node, updateChapter]);

  const promoteCurrent = useCallback(() => {
    if (!chapter || !node) return;
    updateChapter(promoteMainline(chapter, node.id));
  }, [chapter, node, updateChapter]);

  const importPgnText = useCallback(
    (pgn: string, asNewChapter = true) => {
      if (!repertoire) return { ok: false, message: 'No repertoire selected.' };
      try {
        const chapters = importPgn(pgn, 'Imported');
        if (!chapters.length) return { ok: false, message: 'No playable moves found in that PGN.' };
        const imported = chapters[0]!;
        if (asNewChapter || !chapter) {
          const nextRep: Repertoire = {
            ...repertoire,
            updatedAt: Date.now(),
            chapters: [...repertoire.chapters, ...chapters],
          };
          setStore((prev) => ({
            ...prev,
            repertoires: replaceRepertoire(prev.repertoires, nextRep),
          }));
          setChapterId(imported.id);
          setPath([imported.rootId]);
          return {
            ok: true,
            message: `Imported ${chapters.length} chapter${chapters.length > 1 ? 's' : ''}.`,
          };
        }
        // Merge into current chapter from root
        const merged = importPgn(pgn, chapter.name)[0];
        if (!merged) return { ok: false, message: 'Could not parse PGN.' };
        setStore((prev) => ({
          ...prev,
          repertoires: replaceRepertoire(
            prev.repertoires,
            replaceChapter(repertoire, { ...merged, id: chapter.id, name: chapter.name }),
          ),
        }));
        setPath([chapter.rootId]);
        return { ok: true, message: 'Replaced the current chapter with the imported tree.' };
      } catch (err) {
        return { ok: false, message: err instanceof Error ? err.message : 'Import failed.' };
      }
    },
    [repertoire, chapter],
  );

  const createChapter = useCallback(
    (name: string) => {
      if (!repertoire) return;
      const ch = emptyChapter(name);
      const next: Repertoire = {
        ...repertoire,
        chapters: [...repertoire.chapters, ch],
        updatedAt: Date.now(),
      };
      setStore((prev) => ({ ...prev, repertoires: replaceRepertoire(prev.repertoires, next) }));
      setChapterId(ch.id);
      setPath([ch.rootId]);
    },
    [repertoire],
  );

  const createRepertoire = useCallback((name: string, side: Side) => {
    const ch = emptyChapter('Main line');
    const rep: Repertoire = {
      id: uid('rep'),
      name,
      side,
      description: '',
      chapters: [ch],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setStore((prev) => ({ ...prev, repertoires: [...prev.repertoires, rep] }));
    setRepId(rep.id);
    setChapterId(ch.id);
    setPath([ch.rootId]);
    setFlipped(side === 'black');
  }, []);

  const deleteChapter = useCallback(
    (id: string) => {
      if (!repertoire || repertoire.chapters.length <= 1) return;
      const nextChapters = repertoire.chapters.filter((c) => c.id !== id);
      const next: Repertoire = { ...repertoire, chapters: nextChapters, updatedAt: Date.now() };
      setStore((prev) => ({ ...prev, repertoires: replaceRepertoire(prev.repertoires, next) }));
      if (chapterId === id) {
        setChapterId(nextChapters[0]!.id);
        setPath([nextChapters[0]!.rootId]);
      }
    },
    [repertoire, chapterId],
  );

  const deleteRepertoire = useCallback(
    (id: string) => {
      if (store.repertoires.length <= 1) return;
      const next = store.repertoires.filter((r) => r.id !== id);
      setStore({ ...store, repertoires: next });
      if (repId === id) {
        setRepId(next[0]!.id);
        setChapterId(next[0]!.chapters[0]!.id);
        setPath([next[0]!.chapters[0]!.rootId]);
      }
    },
    [store, repId],
  );

  const resetToSeed = useCallback(() => {
    const fresh = resetStore();
    setStore(fresh);
    setRepId(fresh.repertoires[0]!.id);
    setChapterId(fresh.repertoires[0]!.chapters[0]!.id);
    setPath([fresh.repertoires[0]!.chapters[0]!.rootId]);
    setModeState('study');
    setDrill(null);
  }, []);

  const setSettings = useCallback((patch: Partial<BoardSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleHighlight = useCallback((square: string) => {
    setUserHighlights((prev) => {
      const next = { ...prev };
      if (next[square]) delete next[square];
      else next[square] = 'rgba(201, 162, 86, 0.45)';
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, []);

  const lastMove = node?.move ? { from: node.move.from, to: node.move.to } : null;

  const transpositions = useMemo<TranspositionHit[]>(() => {
    if (!chapter || !repertoire || !node) return [];
    const local = findTranspositions(chapter, node.fen, node.id);
    const global = findInRepertoire(repertoire, node.fen, {
      chapterId: chapter.id,
      nodeId: node.id,
    });
    const hits: TranspositionHit[] = [];
    for (const n of local) {
      hits.push({
        chapterName: chapter.name,
        chapterId: chapter.id,
        nodeId: n.id,
        line: formatLine(pathSans(chapter, n.id)) || '(start)',
      });
    }
    for (const g of global) {
      if (g.chapter.id === chapter.id) continue;
      hits.push({
        chapterName: g.chapter.name,
        chapterId: g.chapter.id,
        nodeId: g.node.id,
        line: formatLine(pathSans(g.chapter, g.node.id)) || '(start)',
      });
    }
    return hits;
  }, [chapter, repertoire, node]);

  const master = lookupMaster(fen);

  const legalTargets = useMemo(() => {
    if (!selectedSquare || !node) return [];
    try {
      return legalMovesFrom(node.fen, selectedSquare).map((m) => m.to);
    } catch {
      return [];
    }
  }, [selectedSquare, node]);

  const checkSquare = useMemo(() => {
    try {
      if (!inCheck(fen)) return null;
      const file = fen.split(' ')[0];
      // Find king of side to move
      const turn = fen.split(' ')[1];
      const king = turn === 'w' ? 'K' : 'k';
      const ranks = file?.split('/') ?? [];
      for (let r = 0; r < 8; r++) {
        let fileIdx = 0;
        for (const ch of ranks[r] ?? '') {
          if (/\d/.test(ch)) fileIdx += Number(ch);
          else {
            if (ch === king) {
              return `${'abcdefgh'[fileIdx]}${8 - r}`;
            }
            fileIdx += 1;
          }
        }
      }
    } catch {
      return null;
    }
    return null;
  }, [fen]);

  const due = useMemo(
    () =>
      repertoire && chapter
        ? dueCounts(repertoire, chapter)
        : { due: 0, weak: 0, fresh: 0, chapter: 0, repertoire: 0, blunders: 0, dueAll: 0 },
    [repertoire, chapter],
  );

  const openingMeta: OpeningMeta = {
    name: chapter?.name ?? 'Opening Trainer',
    variation: chapter?.variation ?? '',
    eco: chapter?.eco ?? '',
    side: repertoire?.side ?? 'white',
    repertoireLabel: repertoire ? `Repertoire / ${repertoire.side === 'white' ? 'White' : 'Black'}` : 'Repertoire',
  };

  const srsState: SrsState = useMemo(() => {
    const card = node?.srs;
    const trainable = chapter ? Object.values(chapter.nodes).filter((n) => n.move) : [];
    const avgAcc =
      trainable.length === 0
        ? 0
        : Math.round((trainable.reduce((s, n) => s + n.srs.accuracy, 0) / trainable.length) * 100);
    return {
      level: card ? srsLevel(card) : 0,
      maxLevel: 8,
      nextReviewInDays: card?.lastReviewedAt ? Math.round(card.interval) : 0,
      streakDays: drill?.correctLines ?? 0,
      accuracyPct: avgAcc,
    };
  }, [node, chapter, drill]);

  const hintSquares = useMemo(() => {
    if (mode !== 'drill' || !drill || !chapter || !node || drill.hintLevel === 0) {
      return {};
    }
    const expected = nextLineNode(chapter, drill.line, node.id) ?? mainlineChild(chapter, node.id);
    if (!expected?.move) return {};
    if (drill.hintLevel === 1) return { from: expected.move.from };
    return { from: expected.move.from, to: expected.move.to };
  }, [mode, drill, chapter, node]);

  const prompt: TrainerPrompt = useMemo(() => {
    if (!repertoire || !node) {
      return { side: 'white', kind: 'info', text: 'Load a repertoire to begin.' };
    }
    if (mode === 'study') {
      if (node.comment) {
        return { side: repertoire.side, kind: 'info', text: node.comment };
      }
      if (!node.move) {
        return {
          side: repertoire.side,
          kind: 'question',
          text: `Study mode. Play moves on the board to grow the ${repertoire.side} tree. Right-click arrows to mark plans.`,
        };
      }
      return {
        side: repertoire.side,
        kind: 'info',
        text: node.annotation || `You are on ${formatLine(pathSans(chapter!, node.id)) || 'the starting position'}.`,
      };
    }
    if (!drill) {
      return { side: repertoire.side, kind: 'question', text: 'Start Training to play against your repertoire.' };
    }
    if (drill.lineComplete) {
      return {
        side: repertoire.side,
        kind: 'success',
        text: 'End of this variation. Start Training again — a different branch will be chosen.',
      };
    }
    if (drill.opponentThinking) {
      return {
        side: repertoire.side,
        kind: 'info',
        text: 'Opponent is choosing a book reply…',
      };
    }
    if (drill.awaitingRetry) {
      return {
        side: repertoire.side,
        kind: 'error',
        text: 'Not the repertoire move. Find the book continuation — the position stays until you correct it.',
      };
    }
    const you = repertoire.side === 'white' ? 'White' : 'Black';
    return {
      side: repertoire.side,
      kind: 'question',
      text: `${you} to move. Play your book move — the opponent will answer automatically.`,
    };
  }, [repertoire, node, mode, chapter, drill]);

  const value: TrainerContextValue | null =
    ready && repertoire && chapter && node
      ? {
          ready,
          store,
          repertoire,
          chapter,
          node,
          path,
          fen,
          mode,
          flipped,
          selectedSquare,
          lastMove,
          moveStatus,
          arrows,
          userHighlights,
          promotion,
          premove,
          settings,
          drill,
          hintSquares,
          openingMeta,
          srsState,
          prompt,
          transpositions,
          master,
          legalTargets,
          checkSquare,
          due,
          setSettings,
          setMode,
          startPractice,
          setFilter,
          selectRepertoire,
          selectChapter,
          openLocation,
          goToNode,
          goStart,
          goEnd,
          goBack,
          goForward,
          flipBoard: () => setFlipped((v) => !v),
          restartLine: () => {
            if (mode === 'drill') startPractice();
            else goStart();
          },
          selectSquare: setSelectedSquare,
          playUserMove,
          completePromotion,
          cancelPromotion: () => setPromotion(null),
          requestHint,
          revealSolution,
          nextLine,
          updateCurrent,
          deleteCurrent,
          promoteCurrent,
          importPgnText,
          exportActiveChapter: () =>
            chapter
              ? exportChapterPgn(chapter, {
                  White: repertoire.side === 'white' ? repertoire.name : 'Opponent',
                  Black: repertoire.side === 'black' ? repertoire.name : 'Opponent',
                })
              : '',
          exportActiveRepertoire: () =>
            repertoire ? exportRepertoirePgn(repertoire.name, repertoire.side, repertoire.chapters) : '',
          createChapter,
          createRepertoire,
          deleteChapter,
          deleteRepertoire,
          resetToSeed,
          setArrows,
          toggleHighlight,
          clearMarks: () => {
            setArrows([]);
            setUserHighlights({});
            setSelectedSquare(null);
          },
        }
      : null;

  return <TrainerContext.Provider value={value}>{children}</TrainerContext.Provider>;
}

export function TrainerGate({ children }: { children: React.ReactNode }) {
  const ctx = useContext(TrainerContext);
  if (!ctx) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <p className="font-serif-display text-[15px] italic text-text-muted">Opening the study…</p>
      </div>
    );
  }
  return children;
}

export function useTrainer(): TrainerContextValue {
  const ctx = useContext(TrainerContext);
  if (!ctx) {
    throw new Error('useTrainer must be used within TrainerProvider after load');
  }
  return ctx;
}

export function useTrainerOptional(): TrainerContextValue | null {
  return useContext(TrainerContext);
}
