import { deleteSubtree, patchNode, pathToNode, promoteMainline } from '@/lib/chess';
import { deriveActive } from './deriveActive';
import type { EditingActions, TrainerSlice } from './types';

export const createEditingSlice: TrainerSlice<EditingActions> = (set, get) => ({
  updateCurrent: (patch) => {
    const { chapter, node } = deriveActive(get());
    if (!chapter || !node) return;
    get().updateChapter(patchNode(chapter, node.id, patch));
  },

  deleteCurrent: () => {
    const { chapter, node } = deriveActive(get());
    if (!chapter || !node?.parentId) return;
    const result = deleteSubtree(chapter, node.id);
    get().updateChapter(result.chapter, pathToNode(result.chapter, result.focusId));
  },

  promoteCurrent: () => {
    const { chapter, node } = deriveActive(get());
    if (!chapter || !node) return;
    get().updateChapter(promoteMainline(chapter, node.id));
  },
});
