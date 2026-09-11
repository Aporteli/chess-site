import type { Chapter, TreeNode } from "../types";

export function getNode(chapter: Chapter, id: string): TreeNode {
  const node = chapter.nodes[id];
  if (!node) throw new Error(`Unknown node ${id}`);
  return node;
}

export function childNodes(chapter: Chapter, nodeId: string): TreeNode[] {
  return getNode(chapter, nodeId)
    .children.map((id) => chapter.nodes[id])
    .filter((n): n is TreeNode => Boolean(n));
}

export function pathToNode(chapter: Chapter, nodeId: string): string[] {
  const path: string[] = [];
  let current: string | null = nodeId;
  while (current) {
    path.push(current);
    current = getNode(chapter, current).parentId;
  }
  return path.reverse();
}

export function pathSans(chapter: Chapter, nodeId: string): string[] {
  return pathToNode(chapter, nodeId)
    .map((id) => getNode(chapter, id).move?.san)
    .filter((san): san is string => Boolean(san));
}

export function reconstructSans(chapter: Chapter, nodeId: string): string[] {
  return pathSans(chapter, nodeId);
}

export function childBySan(chapter: Chapter, parentId: string, san: string): TreeNode | undefined {
  return childNodes(chapter, parentId).find((n) => n.move?.san === san);
}

export function mainlineChild(chapter: Chapter, nodeId: string): TreeNode | undefined {
  const kids = childNodes(chapter, nodeId);
  return kids.find((c) => c.isMainline) ?? kids[0];
}

export function sortedChildren(chapter: Chapter, nodeId: string): TreeNode[] {
  return childNodes(chapter, nodeId).sort((a, b) => {
    if (a.isMainline !== b.isMainline) return a.isMainline ? -1 : 1;
    return (b.weight ?? 0) - (a.weight ?? 0);
  });
}