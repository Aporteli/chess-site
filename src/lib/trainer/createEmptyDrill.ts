import type { DrillFilter } from '@/lib/chess';
import type { DrillSession } from './types';

export function createEmptyDrill(filter: DrillFilter): DrillSession {
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
    completedLeaves: [],
  };
}
