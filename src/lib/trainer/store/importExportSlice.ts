import {
  exportChapterPgn,
  exportRepertoirePgn,
  importPgn,
  replaceChapter,
  replaceRepertoire,
  uid,
} from '@/lib/chess';

import { deriveActive } from './deriveActive';
import type { ImportExportActions, TrainerSlice } from './types';

export const createImportExportSlice: TrainerSlice<ImportExportActions> = (set, get) => ({
  importPgnText: (pgn, asNewChapter = true) => {
    const { repertoire, chapter } = deriveActive(get());

    if (!repertoire) {
      return { ok: false, message: 'No repertoire selected.' };
    }

    try {
      const chapters = importPgn(pgn, 'Imported');

      if (!chapters.length) {
        return {
          ok: false,
          message: 'No playable moves found in that PGN.',
        };
      }

      const imported = chapters[0]!;

      if (asNewChapter || !chapter) {
        const nextRep = {
          ...repertoire,
          updatedAt: Date.now(),
          chapters: [...repertoire.chapters, ...chapters],
        };

        set((state) => ({
          store: {
            ...state.store,
            repertoires: replaceRepertoire(
              state.store.repertoires,
              nextRep,
            ),
          },
        }));

        set({
          chapterId: imported.id,
          path: [imported.rootId],
        });

        return {
          ok: true,
          message: `Imported ${chapters.length} chapter${chapters.length > 1 ? 's' : ''}.`,
        };
      }

      const merged = importPgn(pgn, chapter.name)[0];

      if (!merged) {
        return {
          ok: false,
          message: 'Could not parse PGN.',
        };
      }

      set((state) => ({
        store: {
          ...state.store,
          repertoires: replaceRepertoire(
            state.store.repertoires,
            replaceChapter(repertoire, {
              ...merged,
              id: chapter.id,
              name: chapter.name,
            }),
          ),
        },
      }));

      set({
        path: [chapter.rootId],
      });

      return {
        ok: true,
        message: 'Replaced the current chapter with the imported tree.',
      };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : 'Import failed.',
      };
    }
  },

  importLichessStudy: (pgn: string) => {
    const { repertoire } = deriveActive(get());

    try {
      const chapters = importPgn(pgn, 'Imported');

      const playableChapters = chapters.filter(
        (chapter) => Object.keys(chapter.nodes).length > 1,
      );

      if (!playableChapters.length) {
        return {
          ok: false,
          message: 'No playable chapters found in the Lichess Study.',
        };
      }

      const studyName =
        /\[StudyName "([^"]+)"\]/.exec(pgn)?.[1] ??
        playableChapters[0]?.name ??
        'Lichess Study';

      const firstChapter = playableChapters[0]!;
      const now = Date.now();
      const nextRep = {
        id: uid('rep'),
        name: studyName,
        side: repertoire?.side ?? 'white',
        description: '',
        chapters: playableChapters,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => ({
        store: {
          ...state.store,
          repertoires: [...state.store.repertoires, nextRep],
        },
        repId: nextRep.id,
        chapterId: firstChapter.id,
        path: [firstChapter.rootId],
        mode: 'study' as const,
        drill: null,
        selectedSquare: null,
        arrows: [],
        userHighlights: {},
        flipped: nextRep.side === 'black',
      }));

      return {
        ok: true,
        message: `Imported ${playableChapters.length} chapters into “${studyName}”.`,
      };
    } catch (err) {
      return {
        ok: false,
        message:
          err instanceof Error
            ? err.message
            : 'Lichess Study import failed.',
      };
    }
  },

  exportActiveChapter: () => {
    const { repertoire, chapter } = deriveActive(get());

    if (!chapter || !repertoire) {
      return '';
    }

    return exportChapterPgn(chapter, {
      White: repertoire.side === 'white' ? repertoire.name : 'Opponent',
      Black: repertoire.side === 'black' ? repertoire.name : 'Opponent',
    });
  },

  exportActiveRepertoire: () => {
    const { repertoire } = deriveActive(get());

    if (!repertoire) {
      return '';
    }

    return exportRepertoirePgn(
      repertoire.name,
      repertoire.side,
      repertoire.chapters,
    );
  },
});