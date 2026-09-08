import { useMemo } from 'react';
import { dueCounts, type Chapter, type Repertoire } from '@/lib/chess';

const EMPTY_DUE = { due: 0, weak: 0, fresh: 0, chapter: 0, repertoire: 0, blunders: 0, dueAll: 0 };

export function useDueCounts(repertoire: Repertoire | undefined, chapter: Chapter | undefined) {
  return useMemo(
    () => (repertoire && chapter ? dueCounts(repertoire, chapter) : EMPTY_DUE),
    [repertoire, chapter],
  );
}
