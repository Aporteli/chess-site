import {
  gradeFromAttempt,
  getNode,
  isOurTurn,
  isTrainable,
  patchNode,
  pathToNode,
  playSfx,
  reviewCard,
  sfxForMove,
  type DrillCard,
} from '@/lib/chess';
import {
  findNearestUnvisitedFork,
  nextExpectedDrillMove,
  nextRecalledContinuation,
  pickUnvisitedOpponentReply,
  randomChild,
  viableChildren,
} from '@/lib/chess/training';
import { createEmptyDrill } from '../createEmptyDrill';
import type { DrillSession } from '../types';
import { useSettingsStore } from '@/stores/settings-store';
import { deriveActive } from './deriveActive';
import type { DrillActions, TrainerSlice } from './types';

const RECALL_PREVIEW_MS = 450;

let replyTimer: ReturnType<typeof setTimeout> | null = null;
let forkResumeTimer: ReturnType<typeof setTimeout> | null = null;
let recallTimer: ReturnType<typeof setTimeout> | null = null;

/** Cancels pending drill timeouts. Exposed so other slices (e.g. leaving drill mode) can bail out cleanly. */
export function cancelScheduledOpponentReply() {
  if (replyTimer) {
    clearTimeout(replyTimer);
    replyTimer = null;
  }
  if (forkResumeTimer) {
    clearTimeout(forkResumeTimer);
    forkResumeTimer = null;
  }
  if (recallTimer) {
    clearTimeout(recallTimer);
    recallTimer = null;
  }
}

export const createDrillSlice: TrainerSlice<DrillActions> = (set, get) => {
  const playKnownContinuation = (childId: string, session: DrillSession) => {
    const { chapter, repertoire } = deriveActive(get());
    if (!chapter || !repertoire) return;

    const child = chapter.nodes[childId];
    if (!child) return;

    const continued: DrillSession = {
      ...session,
      transitioning: false,
      alternativeState: 'none',
      opponentThinking: false,
      lineComplete: false,
    };

    set({
      path: pathToNode(chapter, child.id),
      selectedSquare: null,
      promotion: null,
      drill: continued,
    });

    if (child.move) {
      playSfx(sfxForMove(child.move.flags), useSettingsStore.getState().sound);
    }

    if (child.children.length === 0) {
      get().finishPractice(continued, pathToNode(chapter, child.id));
    } else if (!isOurTurn(child.fen, repertoire.side)) {
      get().scheduleOpponent(child.id, continued);
    }
  };

  return {
    startPractice: (target) => {
      const { chapter, repertoire } = deriveActive(get());
      const ch = target ?? chapter;
      if (!repertoire || !ch) return;
      cancelScheduledOpponentReply();

      set({
        mode: 'drill',
        chapterId: ch.id,
        path: [ch.rootId],
        selectedSquare: null,
        moveStatus: 'pending',
        premove: null,
        arrows: [],
        userHighlights: {},
        promotion: null,
      });

      const card: DrillCard = {
        chapterId: ch.id,
        nodeId: ch.rootId,
        parentId: ch.rootId,
        reason: 'chapter',
      };

      const session: DrillSession = {
        ...createEmptyDrill('chapter'),
        queue: [card],
        sessionOver: false,
        lineComplete: false,
        opponentThinking: false,
        completedLeaves: [],
        recalledByFork: {},
      };
      set({ drill: session });

      const root = getNode(ch, ch.rootId);
      const isUserTurn = isOurTurn(root.fen, repertoire.side);
      if (!isUserTurn && root.children.length > 0) {
        get().scheduleOpponent(root.id, session);
      }
    },

    scheduleOpponent: (fromNodeId, session) => {
      const { chapter, repertoire } = deriveActive(get());
      if (!chapter || !repertoire) return;

      const completedSet = new Set(session.completedLeaves);
      const nextMoveNode = pickUnvisitedOpponentReply(chapter, fromNodeId, completedSet);

      if (!nextMoveNode) {
        get().finishPractice(session, pathToNode(chapter, fromNodeId));
        return;
      }

      set({ drill: { ...session, opponentThinking: true, lineComplete: false } });
      if (replyTimer) clearTimeout(replyTimer);

      replyTimer = setTimeout(() => {
        const { chapter: latest, repertoire: latestRep } = deriveActive(get());
        const ch = latest ?? chapter;
        const side = latestRep?.side ?? repertoire.side;
        const chosen = ch.nodes[nextMoveNode.id] ?? nextMoveNode;

        set({ path: pathToNode(ch, chosen.id) });
        playSfx(sfxForMove(chosen.move!.flags), useSettingsStore.getState().sound);
        set((state) => ({
          drill: state.drill ? { ...state.drill, opponentThinking: false, lineComplete: false } : state.drill,
        }));

        if (chosen.children.length === 0) {
          get().finishPractice(session, pathToNode(ch, chosen.id));
          return;
        }
        if (!isOurTurn(chosen.fen, side)) {
          get().scheduleOpponent(chosen.id, session);
        }
      }, 300);
    },

    acceptDrillMove: (playedChildId) => {
      const { chapter, repertoire, node } = deriveActive(get());
      const { drill } = get();
      if (!chapter || !repertoire || !node || !drill) return false;

      const played = chapter.nodes[playedChildId];
      if (!played) return false;

      const completedSet = new Set(drill.completedLeaves);
      const recalledByFork = drill.recalledByFork ?? {};
      const viable = viableChildren(chapter, node.id, completedSet);
      const recalled = recalledByFork[node.id] ?? [];
      const alreadyRecalled = recalled.includes(playedChildId);
      const isViable = viable.some((kid) => kid.id === playedChildId);

      if (alreadyRecalled || !isViable) {
        playSfx('success', useSettingsStore.getState().sound);
        get().flashStatus('alternative');
        set({
          selectedSquare: null,
          drill: {
            ...drill,
            recalledByFork,
            awaitingRetry: false,
            alternativeState: 'repeat',
            transitioning: false,
          },
        });
        return false;
      }

      const isMultiRecall = viable.length > 1;
      const stillMissing = viable.filter((kid) => kid.id !== playedChildId && !recalled.includes(kid.id));
      const nextRecalled = isMultiRecall ? [...recalled, playedChildId] : recalled;
      const nextSession: DrillSession = {
        ...drill,
        awaitingRetry: false,
        recalledByFork: isMultiRecall ? { ...recalledByFork, [node.id]: nextRecalled } : recalledByFork,
      };

      playSfx('success', useSettingsStore.getState().sound);

      if (isMultiRecall && stillMissing.length > 0) {
        get().flashStatus('alternative');
        const previewing: DrillSession = { ...nextSession, alternativeState: 'more', transitioning: true };
        set({
          path: pathToNode(chapter, played.id),
          selectedSquare: null,
          promotion: null,
          drill: previewing,
        });
        if (recallTimer) clearTimeout(recallTimer);
        const forkId = node.id;
        recallTimer = setTimeout(() => {
          const latest = get().drill;
          if (!latest) return;
          const { chapter: current } = deriveActive(get());
          const ch = current ?? chapter;
          set({
            path: pathToNode(ch, forkId),
            selectedSquare: null,
            drill: { ...latest, transitioning: false, alternativeState: 'more' },
          });
        }, RECALL_PREVIEW_MS);
        return true;
      }

      if (isMultiRecall && stillMissing.length === 0) {
        get().flashStatus('correct');
        const previewing: DrillSession = { ...nextSession, alternativeState: 'none', transitioning: true };
        set({
          path: pathToNode(chapter, played.id),
          selectedSquare: null,
          promotion: null,
          drill: previewing,
        });
        if (recallTimer) clearTimeout(recallTimer);
        const forkId = node.id;
        recallTimer = setTimeout(() => {
          const latest = get().drill;
          if (!latest) return;
          const { chapter: current } = deriveActive(get());
          const ch = current ?? chapter;
          const first = nextRecalledContinuation(
            ch,
            forkId,
            latest.recalledByFork ?? {},
            new Set(latest.completedLeaves),
          );
          set({
            path: pathToNode(ch, forkId),
            selectedSquare: null,
            drill: { ...latest, transitioning: true, alternativeState: 'none' },
          });
          if (!first) {
            set((state) => ({
              drill: state.drill ? { ...state.drill, transitioning: false } : state.drill,
            }));
            return;
          }
          recallTimer = setTimeout(() => {
            const currentSession = get().drill;
            if (!currentSession) return;
            playKnownContinuation(first.id, { ...currentSession, transitioning: false });
          }, 250);
        }, RECALL_PREVIEW_MS);
        return true;
      }

      get().flashStatus('correct');
      const continued: DrillSession = { ...nextSession, alternativeState: 'none', transitioning: false };
      set({
        path: pathToNode(chapter, played.id),
        selectedSquare: null,
        promotion: null,
        drill: continued,
      });

      if (played.children.length === 0) {
        get().finishPractice(continued, pathToNode(chapter, played.id));
      } else {
        get().scheduleOpponent(played.id, continued);
      }
      return true;
    },

    finishPractice: (session, visited) => {
      const { chapter, repertoire } = deriveActive(get());
      if (!chapter || !repertoire) return;

      const leafId = visited[visited.length - 1] ?? chapter.rootId;
      const nextCompleted = Array.from(new Set([...session.completedLeaves, leafId]));
      const completedSet = new Set(nextCompleted);

      const forkNodeId = findNearestUnvisitedFork(chapter, leafId, completedSet);

      let nextChapter = chapter;
      const grade = gradeFromAttempt({
        mistakes: session.mistakes,
        hintLevel: session.hintLevel,
        usedSolution: session.usedSolution,
      });
      for (const id of visited) {
        const n = nextChapter.nodes[id];
        if (n?.move && isTrainable(n, repertoire.side)) {
          nextChapter = patchNode(nextChapter, id, { srs: reviewCard(n.srs, grade) });
        }
      }
      if (nextChapter !== chapter) get().updateChapter(nextChapter);

      const reviewed = session.reviewed + 1;
      const correctLines = session.correctLines + (grade === 'again' ? 0 : 1);
      get().flashStatus(grade === 'again' ? 'mistake' : 'correct');

      if (!forkNodeId) {
        set({
          drill: {
            ...session,
            reviewed,
            correctLines,
            completedLeaves: nextCompleted,
            lineComplete: true,
            sessionOver: true,
            opponentThinking: false,
            transitioning: false,
            alternativeState: 'none',
            mistakes: 0,
            hintLevel: 0,
            usedSolution: false,
            awaitingRetry: false,
          },
        });
        return;
      }

      set({
        drill: {
          ...session,
          reviewed,
          correctLines,
          completedLeaves: nextCompleted,
          lineComplete: true,
          opponentThinking: false,
          transitioning: false,
          alternativeState: 'none',
        },
      });

      if (forkResumeTimer) clearTimeout(forkResumeTimer);
      forkResumeTimer = setTimeout(() => {
        const { chapter: currentChapter, repertoire: currentRep } = deriveActive(get());
        const ch = currentChapter ?? chapter;
        const rep = currentRep ?? repertoire;

        const updatedSession: DrillSession = {
          ...session,
          reviewed,
          correctLines,
          completedLeaves: nextCompleted,
          lineComplete: false,
          awaitingRetry: false,
          opponentThinking: false,
          transitioning: false,
          alternativeState: 'none',
          mistakes: 0,
          hintLevel: 0,
          usedSolution: false,
        };

        const forkNode = getNode(ch, forkNodeId);
        if (!isOurTurn(forkNode.fen, rep.side) && forkNode.children.length > 0) {
          set({ path: pathToNode(ch, forkNodeId), drill: updatedSession });
          get().scheduleOpponent(forkNode.id, updatedSession);
          return;
        }

        const nextChild = nextRecalledContinuation(
          ch,
          forkNodeId,
          updatedSession.recalledByFork ?? {},
          completedSet,
        );
        if (nextChild) {
          set({ path: pathToNode(ch, forkNodeId), drill: updatedSession });
          if (recallTimer) clearTimeout(recallTimer);
          recallTimer = setTimeout(() => {
            const latest = get().drill;
            if (!latest) return;
            playKnownContinuation(nextChild.id, latest);
          }, 300);
          return;
        }

        set({ path: pathToNode(ch, forkNodeId), drill: updatedSession });
      }, 600);
    },

    requestHint: () => {
      const { chapter, node } = deriveActive(get());
      const { mode, drill } = get();
      if (mode !== 'drill' || !drill || !chapter || !node) return;
      const expected =
        nextExpectedDrillMove(chapter, node.id, drill.line, new Set(drill.completedLeaves), drill.recalledByFork ?? {}) ??
        randomChild(chapter, node.id);
      if (!expected?.move) return;
      set({ drill: { ...drill, hintLevel: Math.min(3, drill.hintLevel + 1) } });
    },

    revealSolution: () => {
      const { chapter, node } = deriveActive(get());
      const { mode, drill } = get();
      if (mode !== 'drill' || !drill || !chapter || !node) return;
      const expected =
        nextExpectedDrillMove(chapter, node.id, drill.line, new Set(drill.completedLeaves), drill.recalledByFork ?? {}) ??
        randomChild(chapter, node.id);
      if (!expected?.move) return;
      set({ drill: { ...drill, usedSolution: true, hintLevel: 3 } });
      get().playUserMove(expected.move.from, expected.move.to, expected.move.promotion);
    },

    nextLine: () => get().startPractice(),
  };
};
