import type { Chapter, Repertoire } from '@/lib/chess';
import type { OpeningMeta } from '@/lib/types';

export function useOpeningMeta(repertoire: Repertoire | undefined, chapter: Chapter | undefined): OpeningMeta {
  return {
    name: chapter?.name ?? 'Opening Trainer',
    variation: chapter?.variation ?? '',
    eco: chapter?.eco ?? '',
    side: repertoire?.side ?? 'white',
    repertoireLabel: repertoire ? `Repertoire / ${repertoire.side === 'white' ? 'White' : 'Black'}` : 'Repertoire',
  };
}
