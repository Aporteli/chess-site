import type { DrillFilter, DrillCard } from '@/lib/chess';

/** One active practice session: the queue of cards being drilled and its progress. */
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
  line: string[];
  completedLeaves: string[];
}

/** A move waiting on a promotion-piece choice from the user. */
export interface PendingPromo {
  from: string;
  to: string;
}

/** A pre-queued move, played once it becomes the user's turn. */
export interface Premove {
  from: string;
  to: string;
  promotion?: string;
}

/** A place elsewhere in the repertoire where the current position also occurs. */
export interface TranspositionHit {
  chapterName: string;
  line: string;
  nodeId: string;
  chapterId: string;
}
