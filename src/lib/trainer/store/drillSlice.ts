import {
  findNearestUnvisitedFork,
  gradeFromAttempt,
  getNode,
  isOurTurn,
  isTrainable,
  mainlineChild,
  nextLineNode,
  patchNode,
  pathToNode,
  pickUnvisitedOpponentReply,
  playSfx,
  randomChild,
  reviewCard,
  sfxForMove,
  type DrillCard,
} from '@/lib/chess';
import { createEmptyDrill } from '../createEmptyDrill';
import type { DrillSession } from '../types';
import { deriveActive } from './deriveActive';
import type { DrillActions, TrainerSlice } from './types';

let replyTimer: ReturnType<typeof setTimeout> | null = null;
let forkResumeTimer: ReturnType<typeof setTimeout> | null = null;

/** Cancels a pending opponent-reply timeout. Exposed so other slices (e.g. leaving drill mode) can bail out cleanly. */
export function cancelScheduledOpponentReply() {
  if (replyTimer) clearTimeout(replyTimer);
}

export const createDrillSlice: TrainerSlice<DrillActions> = (set, get) => ({
  startPractice: (target) => {
    const { chapter, repertoire } = deriveActive(get());
    const ch = target ?? chapter;
    if (!repertoire || !ch) return;
    if (replyTimer) clearTimeout(replyTimer);

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
      playSfx(sfxForMove(chosen.move!.flags), get().settings.sound);
      set((state) => ({ drill: state.drill ? { ...state.drill, opponentThinking: false, lineComplete: false } : state.drill }));

      if (chosen.children.length === 0) {
        get().finishPractice(session, pathToNode(ch, chosen.id));
        return;
      }
      if (!isOurTurn(chosen.fen, side)) {
        get().scheduleOpponent(chosen.id, session);
      }
    }, 300);
  },

  finishPractice: (session, visited) => {
    const { chapter, repertoire } = deriveActive(get());
    if (!chapter || !repertoire) return;

    const leafId = visited[visited.length - 1] ?? chapter.rootId;
    const nextCompleted = Array.from(new Set([...session.completedLeaves, leafId]));
    const completedSet = new Set(nextCompleted);

    // Nearest ancestor fork that still has an unvisited branch.
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
          mistakes: 0,
          hintLevel: 0,
          usedSolution: false,
          awaitingRetry: false,
        },
      });
      return;
    }

    set({
      drill: { ...session, reviewed, correctLines, completedLeaves: nextCompleted, lineComplete: true, opponentThinking: false },
    });

    if (forkResumeTimer) clearTimeout(forkResumeTimer);
    forkResumeTimer = setTimeout(() => {
      const { chapter: currentChapter, repertoire: currentRep } = deriveActive(get());
      const ch = currentChapter ?? chapter;
      const rep = currentRep ?? repertoire;

      set({ path: pathToNode(ch, forkNodeId) });

      const updatedSession: DrillSession = {
        ...session,
        reviewed,
        correctLines,
        completedLeaves: nextCompleted,
        lineComplete: false,
        awaitingRetry: false,
        opponentThinking: false,
        mistakes: 0,
        hintLevel: 0,
        usedSolution: false,
      };
      set({ drill: updatedSession });

      const forkNode = getNode(ch, forkNodeId);
      if (!isOurTurn(forkNode.fen, rep.side) && forkNode.children.length > 0) {
        get().scheduleOpponent(forkNode.id, updatedSession);
      }
    }, 600);
  },

  requestHint: () => {
    const { chapter, node } = deriveActive(get());
    const { mode, drill } = get();
    if (mode !== 'drill' || !drill || !chapter || !node) return;
    const expected = nextLineNode(chapter, drill.line, node.id) ?? mainlineChild(chapter, node.id);
    if (!expected?.move) return;
    set({ drill: { ...drill, hintLevel: Math.min(3, drill.hintLevel + 1) } });
  },

  revealSolution: () => {
    const { chapter, node } = deriveActive(get());
    const { mode, drill } = get();
    if (mode !== 'drill' || !drill || !chapter || !node) return;
    const expected =
      nextLineNode(chapter, drill.line, node.id) ?? mainlineChild(chapter, node.id) ?? randomChild(chapter, node.id);
    if (!expected?.move) return;
    set({ drill: { ...drill, usedSolution: true, hintLevel: 3 } });
    get().playUserMove(expected.move.from, expected.move.to, expected.move.promotion);
  },

  nextLine: () => get().startPractice(),
});
