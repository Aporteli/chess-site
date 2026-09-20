import type { Repertoire, RepertoireSummary } from '@/lib/chess';

/** Metadata view of a loaded repertoire — keeps the library index in sync without a refetch. */
export function toRepertoireSummary(repertoire: Repertoire): RepertoireSummary {
  return {
    id: repertoire.id,
    name: repertoire.name,
    side: repertoire.side,
    chapterCount: repertoire.chapters.length,
  };
}

/** Inserts or replaces a repertoire's index entry. Returns the same array when nothing changed. */
export function upsertRepertoireSummary(
  library: RepertoireSummary[],
  repertoire: Repertoire,
): RepertoireSummary[] {
  const summary = toRepertoireSummary(repertoire);
  const index = library.findIndex((entry) => entry.id === summary.id);
  if (index === -1) return [...library, summary];

  const current = library[index]!;
  if (
    current.name === summary.name &&
    current.side === summary.side &&
    current.chapterCount === summary.chapterCount
  ) {
    return library;
  }

  const next = [...library];
  next[index] = summary;
  return next;
}
