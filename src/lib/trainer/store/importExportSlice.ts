import { exportChapterPgn, exportRepertoirePgn, importPgn, replaceChapter, replaceRepertoire } from '@/lib/chess';
import { deriveActive } from './deriveActive';
import type { ImportExportActions, TrainerSlice } from './types';

export const createImportExportSlice: TrainerSlice<ImportExportActions> = (set, get) => ({
  importPgnText: (pgn, asNewChapter = true) => {
    const { repertoire, chapter } = deriveActive(get());
    if (!repertoire) return { ok: false, message: 'No repertoire selected.' };
    try {
      const chapters = importPgn(pgn, 'Imported');
      if (!chapters.length) return { ok: false, message: 'No playable moves found in that PGN.' };
      const imported = chapters[0]!;

      if (asNewChapter || !chapter) {
        const nextRep = {
          ...repertoire,
          updatedAt: Date.now(),
          chapters: [...repertoire.chapters, ...chapters],
        };
        set((state) => ({ store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, nextRep) } }));
        set({ chapterId: imported.id, path: [imported.rootId] });
        return { ok: true, message: `Imported ${chapters.length} chapter${chapters.length > 1 ? 's' : ''}.` };
      }

      const merged = importPgn(pgn, chapter.name)[0];
      if (!merged) return { ok: false, message: 'Could not parse PGN.' };
      set((state) => ({
        store: {
          ...state.store,
          repertoires: replaceRepertoire(
            state.store.repertoires,
            replaceChapter(repertoire, { ...merged, id: chapter.id, name: chapter.name }),
          ),
        },
      }));
      set({ path: [chapter.rootId] });
      return { ok: true, message: 'Replaced the current chapter with the imported tree.' };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : 'Import failed.' };
    }
  },

  exportActiveChapter: () => {
    const { repertoire, chapter } = deriveActive(get());
    if (!chapter || !repertoire) return '';
    return exportChapterPgn(chapter, {
      White: repertoire.side === 'white' ? repertoire.name : 'Opponent',
      Black: repertoire.side === 'black' ? repertoire.name : 'Opponent',
    });
  },

  exportActiveRepertoire: () => {
    const { repertoire } = deriveActive(get());
    if (!repertoire) return '';
    return exportRepertoirePgn(repertoire.name, repertoire.side, repertoire.chapters);
  },
});
