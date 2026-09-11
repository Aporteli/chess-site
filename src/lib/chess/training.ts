import type { Chapter, TreeNode } from "./types";
import { childNodes } from "./tree/tree-navigation";

export function weightedChild(chapter: Chapter, nodeId: string): TreeNode | undefined {
  const kids = childNodes(chapter, nodeId);
  if (!kids.length) return undefined;
  const total = kids.reduce((s, k) => s + Math.max(0.05, k.weight), 0);
  let roll = Math.random() * total;
  for (const kid of kids) {
    roll -= Math.max(0.05, kid.weight);
    if (roll <= 0) return kid;
  }
  return kids[kids.length - 1];
}

export function randomChild(chapter: Chapter, nodeId: string): TreeNode | undefined {
  const kids = childNodes(chapter, nodeId);
  if (kids.length === 0) return undefined;
  return kids[Math.floor(Math.random() * kids.length)];
}

export function collectLinesFrom(chapter: Chapter, nodeId: string): string[][] {
  const lines: string[][] = [];
  const walk = (id: string, acc: string[]) => {
    const path = [...acc, id];
    const kids = childNodes(chapter, id);
    if (kids.length === 0) {
      lines.push(path);
      return;
    }
    for (const kid of kids) walk(kid.id, path);
  };
  walk(nodeId, []);
  return lines;
}

export function pickTrainingLine(
  chapter: Chapter,
  fromId: string,
  avoidLeafId?: string | null,
): string[] {
  const lines = collectLinesFrom(chapter, fromId);
  if (lines.length === 0) return [fromId];
  const pool =
    avoidLeafId && lines.length > 1
      ? lines.filter((line) => line[line.length - 1] !== avoidLeafId)
      : lines;
  return pool[Math.floor(Math.random() * pool.length)] ?? lines[0]!;
}

export function nextLineNode(
  chapter: Chapter,
  line: string[],
  fromId: string,
): TreeNode | undefined {
  const index = line.indexOf(fromId);
  if (index < 0 || index + 1 >= line.length) return undefined;
  return chapter.nodes[line[index + 1]!];
}

export function pickOpponentReply(
  chapter: Chapter,
  nodeId: string,
  _line?: string[],
): TreeNode | undefined {
  return randomChild(chapter, nodeId);
}

export function getLeafIdsUnder(chapter: Chapter, nodeId: string): string[] {
  const leaves: string[] = [];
  const walk = (id: string) => {
    const node = chapter.nodes[id];
    if (!node || node.children.length === 0) {
      leaves.push(id);
      return;
    }
    for (const childId of node.children) {
      walk(childId);
    }
  };
  walk(nodeId);
  return leaves;
}

export function pickUnvisitedOpponentReply(
  chapter: Chapter,
  nodeId: string,
  completedLeaves: Set<string>,
): TreeNode | undefined {
  const kids = childNodes(chapter, nodeId);
  if (kids.length === 0) return undefined;

  const viableKids = kids.filter((kid) => {
    const leaves = getLeafIdsUnder(chapter, kid.id);
    return leaves.some((leafId) => !completedLeaves.has(leafId));
  });

  const pool = viableKids.length > 0 ? viableKids : kids;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function findNearestUnvisitedFork(
  chapter: Chapter,
  leafId: string,
  completedLeaves: Set<string>,
): string | null {
  const startNode = chapter.nodes[leafId] as TreeNode | undefined;
  let currentId: string | null = startNode?.parentId ?? null;

  while (currentId) {
    const node: TreeNode | undefined = chapter.nodes[currentId];
    if (!node) break;

    const leaves = getLeafIdsUnder(chapter, currentId);
    const hasUnvisited = leaves.some((id) => !completedLeaves.has(id));

    if (hasUnvisited) {
      return currentId;
    }

    currentId = node.parentId;
  }

  return null;
}