import type { Chapter, Repertoire, TreeNode } from '@/lib/chess';
import type { TrainerRawState } from './types';

export interface ActiveEntities {
  repertoire: Repertoire | undefined;
  chapter: Chapter | undefined;
  node: TreeNode | undefined;
  fen: string;
}

const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

export type ActiveEntitiesInput = Pick<TrainerRawState, 'store' | 'repId' | 'chapterId' | 'path'>;

export function deriveActive(state: ActiveEntitiesInput): ActiveEntities {
  const repertoire = state.store.repertoires.find((r) => r.id === state.repId) ?? state.store.repertoires[0];
  const chapter = repertoire?.chapters.find((c) => c.id === state.chapterId) ?? repertoire?.chapters[0];
  const currentId = state.path[state.path.length - 1] ?? chapter?.rootId ?? '';
  const node = chapter && currentId ? chapter.nodes[currentId] : undefined;
  const fen = node?.fen ?? EMPTY_FEN;
  return { repertoire, chapter, node, fen };
}
