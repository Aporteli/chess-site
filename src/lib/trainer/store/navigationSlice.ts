import { isOurTurn, mainlineChild, pathToNode, saveSession } from '@/lib/chess';
import { randomChild } from '@/lib/chess/training';
import { deriveActive } from './deriveActive';
import type { NavigationActions, TrainerSlice } from './types';

export const createNavigationSlice: TrainerSlice<NavigationActions> = (set, get) => ({
  selectRepertoire: (id) => {
    const { store } = get();
    const rep = store.repertoires.find((r) => r.id === id);
    if (!rep) return;
    const ch = rep.chapters[0];
    set({
      repId: id,
      ...(ch ? { chapterId: ch.id, path: [ch.rootId] } : {}),
      flipped: rep.side === 'black',
      mode: 'study',
      drill: null,
    });
    if (ch) saveSession({ repertoireId: id, chapterId: ch.id });
  },

  selectChapter: (id) => {
    const { repertoire } = deriveActive(get());
    const ch = repertoire?.chapters.find((c) => c.id === id);
    if (!ch) return;
    set({ chapterId: id, path: [ch.rootId], selectedSquare: null });
    if (repertoire) saveSession({ repertoireId: repertoire.id, chapterId: id });
    if (get().mode === 'drill') get().startPractice(ch);
  },

  openLocation: (chapterId, nodeId) => {
    const { repertoire } = deriveActive(get());
    const ch = repertoire?.chapters.find((c) => c.id === chapterId);
    if (!ch || !ch.nodes[nodeId]) return;
    set({ chapterId, path: pathToNode(ch, nodeId), selectedSquare: null });
  },

  goToNode: (id) => {
    const { chapter } = deriveActive(get());
    if (!chapter || !chapter.nodes[id]) return;
    set({ path: pathToNode(chapter, id), selectedSquare: null });
  },

  goStart: () => {
    const { chapter } = deriveActive(get());
    if (!chapter) return;
    set({ path: [chapter.rootId] });
  },

  goBack: () => {
    const { path } = get();
    if (path.length > 1) set({ path: path.slice(0, -1) });
  },

  goForward: () => {
    const { repertoire, chapter, node } = deriveActive(get());
    const { mode, drill } = get();
    if (!chapter || !node || !repertoire) return;
    if (mode === 'drill' && drill && !drill.lineComplete && !isOurTurn(node.fen, repertoire.side)) {
      get().scheduleOpponent(node.id, drill);
      return;
    }
    const child = mainlineChild(chapter, node.id) ?? randomChild(chapter, node.id);
    if (child) set({ path: pathToNode(chapter, child.id) });
  },

  goEnd: () => {
    const { chapter, node } = deriveActive(get());
    if (!chapter || !node) return;
    const next = [...get().path];
    let cursor = node;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const child = mainlineChild(chapter, cursor.id);
      if (!child) break;
      next.push(child.id);
      cursor = child;
    }
    set({ path: next });
  },
});
