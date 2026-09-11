import { isDue, isNew, isWeak } from './srs/srs-metrics';
import { getNode, pathToNode } from './tree/tree-navigation';
import { collectTrainable } from './tree/tree-utils';
import type { Chapter, DrillCard, DrillFilter, Repertoire, TreeNode } from './types';

export function cardPriority(node: TreeNode, now = Date.now()): number {
  const overdue = Math.max(0, now - node.srs.dueAt) / 86_400_000;
  const weak = node.srs.lapses * 3 + (1 - node.srs.accuracy) * 8;
  const early = Math.max(0, 8 - node.ply) * 0.35;
  return overdue * 2 + weak + early;
}

export function buildQueue(
  repertoire: Repertoire,
  chapter: Chapter,
  filter: DrillFilter,
  now = Date.now(),
): DrillCard[] {
  const chapters = filter === 'repertoire' ? repertoire.chapters : [chapter];

  // 1. Map ჩაპტერების სწრაფი O(1) წვდომისთვის
  const chapterMap = new Map(chapters.map((c) => [c.id, c]));
  const cardsWithPriority: Array<{ card: DrillCard; priority: number }> = [];

  for (const ch of chapters) {
    for (const node of collectTrainable(ch, repertoire.side)) {
      if (!node.parentId) continue;

      let reason: DrillFilter | null = null;

      if (filter === 'due' && isDue(node.srs, now)) reason = 'due';
      else if (filter === 'weak' && isWeak(node.srs)) reason = 'weak';
      else if (filter === 'new' && isNew(node.srs)) reason = 'new';
      else if (filter === 'chapter' || filter === 'repertoire') reason = filter;
      else if (filter === 'blunders') {
        const isBlunder = node.nags.includes(4) || node.nags.includes(2);
        const parent = getNode(ch, node.parentId);
        const siblingBlunder = parent.children
          .map((id: string) => getNode(ch, id))
          .some((c: TreeNode) => c.nags.includes(4) || c.nags.includes(2));

        if (isBlunder || siblingBlunder) reason = 'blunders';
      }

      // 2. პრიორიტეტს ვითვლით ერთხელ შექმნისას და არა sort-ის შიგნით
      if (reason) {
        cardsWithPriority.push({
          card: { chapterId: ch.id, nodeId: node.id, parentId: node.parentId, reason },
          priority: cardPriority(node, now),
        });
      }
    }
  }

  // 3. სწრაფი სორტირება წინასწარ დათვლილი პრიორიტეტებით
  return cardsWithPriority.sort((a, b) => b.priority - a.priority).map((item) => item.card);
}

export function dueCounts(repertoire: Repertoire, chapter: Chapter, now = Date.now()) {
  const chapterNodes = collectTrainable(chapter, repertoire.side);
  const all = repertoire.chapters.flatMap((ch) => collectTrainable(ch, repertoire.side));

  return {
    due: chapterNodes.filter((n) => isDue(n.srs, now)).length,
    weak: chapterNodes.filter((n) => isWeak(n.srs)).length,
    fresh: chapterNodes.filter((n) => isNew(n.srs)).length,
    chapter: chapterNodes.length,
    repertoire: all.length,
    blunders: chapterNodes.filter((n) => n.nags.includes(2) || n.nags.includes(4)).length,
    dueAll: all.filter((n) => isDue(n.srs, now)).length,
  };
}

export function setupPathForCard(chapter: Chapter, card: DrillCard): string[] {
  return pathToNode(chapter, card.parentId);
}
