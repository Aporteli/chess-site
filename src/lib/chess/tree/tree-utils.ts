import { fenTurn, normalizeFen } from "../fen";
import type { Chapter, Repertoire, TreeNode } from "../types";

export function isTrainable(node: TreeNode, side: "white" | "black"): boolean {
  if (!node.move) return false;
  return (fenTurn(node.fen) === "w" ? "black" : "white") === side;
}

export function collectTrainable(chapter: Chapter, side: "white" | "black"): TreeNode[] {
  return Object.values(chapter.nodes).filter((n) => isTrainable(n, side));
}

export function nodeCount(chapter: Chapter): number {
  return Object.keys(chapter.nodes).length - 1;
}

export function deepestPly(chapter: Chapter): number {
  return Object.values(chapter.nodes).reduce((m, n) => Math.max(m, n.ply), 0);
}

export function replaceChapter(repertoire: Repertoire, chapter: Chapter): Repertoire {
  return {
    ...repertoire,
    updatedAt: Date.now(),
    chapters: repertoire.chapters.map((c) => (c.id === chapter.id ? chapter : c)),
  };
}

export function replaceRepertoire(repertoires: Repertoire[], next: Repertoire): Repertoire[] {
  return repertoires.map((r) => (r.id === next.id ? next : r));
}

export function findTranspositions(chapter: Chapter, fen: string, excludeId?: string): TreeNode[] {
  const key = normalizeFen(fen);
  return Object.values(chapter.nodes).filter(
    (n) => n.id !== excludeId && normalizeFen(n.fen) === key,
  );
}

export function findInRepertoire(
  repertoire: Repertoire,
  fen: string,
  exclude?: { chapterId: string; nodeId: string },
): { chapter: Chapter; node: TreeNode }[] {
  const key = normalizeFen(fen);
  const hits: { chapter: Chapter; node: TreeNode }[] = [];
  for (const chapter of repertoire.chapters) {
    for (const node of Object.values(chapter.nodes)) {
      if (exclude && chapter.id === exclude.chapterId && node.id === exclude.nodeId) continue;
      if (normalizeFen(node.fen) === key) hits.push({ chapter, node });
    }
  }
  return hits;
}