import { useMemo } from 'react';
import { findInRepertoire, findTranspositions, formatLine, pathSans } from '@/lib/chess';
import type { ActiveEntities } from '../store/deriveActive';
import type { TranspositionHit } from '../types';

export function useTranspositions({ chapter, repertoire, node }: ActiveEntities): TranspositionHit[] {
  return useMemo(() => {
    if (!chapter || !repertoire || !node) return [];
    const local = findTranspositions(chapter, node.fen, node.id);
    const global = findInRepertoire(repertoire, node.fen, { chapterId: chapter.id, nodeId: node.id });

    const hits: TranspositionHit[] = [];
    for (const n of local) {
      hits.push({
        chapterName: chapter.name,
        chapterId: chapter.id,
        nodeId: n.id,
        line: formatLine(pathSans(chapter, n.id)) || '(start)',
      });
    }
    for (const g of global) {
      if (g.chapter.id === chapter.id) continue;
      hits.push({
        chapterName: g.chapter.name,
        chapterId: g.chapter.id,
        nodeId: g.node.id,
        line: formatLine(pathSans(g.chapter, g.node.id)) || '(start)',
      });
    }
    return hits;
  }, [chapter, repertoire, node]);
}
