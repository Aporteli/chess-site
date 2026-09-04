import { isDue, isNew, isWeak } from "./srs";
import { collectTrainable, getNode, pathToNode } from "./tree";
import type { Chapter, DrillCard, DrillFilter, Repertoire, TreeNode } from "./types";

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
  const chapters = filter === "repertoire" ? repertoire.chapters : [chapter];
  const cards: DrillCard[] = [];

  for (const ch of chapters) {
    for (const node of collectTrainable(ch, repertoire.side)) {
      if (!node.parentId) continue;
      let reason: DrillFilter | null = null;
      if (filter === "due" && isDue(node.srs, now)) reason = "due";
      else if (filter === "weak" && isWeak(node.srs)) reason = "weak";
      else if (filter === "new" && isNew(node.srs)) reason = "new";
      else if (filter === "chapter" || filter === "repertoire") reason = filter;
      else if (filter === "blunders") {
        const isBlunder = node.nags.includes(4) || node.nags.includes(2);
        const parent = getNode(ch, node.parentId);
        const siblingBlunder = parent.children
          .map((id) => getNode(ch, id))
          .some((c) => c.nags.includes(4) || c.nags.includes(2));
        if (isBlunder || siblingBlunder) reason = "blunders";
      }
      if (reason) {
        cards.push({
          chapterId: ch.id,
          nodeId: node.id,
          parentId: node.parentId,
          reason,
        });
      }
    }
  }

  return cards.sort((a, b) => {
    const na = getNode(
      chapters.find((c) => c.id === a.chapterId) ?? chapter,
      a.nodeId,
    );
    const nb = getNode(
      chapters.find((c) => c.id === b.chapterId) ?? chapter,
      b.nodeId,
    );
    return cardPriority(nb, now) - cardPriority(na, now);
  });
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
