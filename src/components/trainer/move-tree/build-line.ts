import { childNodes, type Chapter, type TreeNode } from "@/lib/chess";

export function buildMainlineNodes(
  chapter: Chapter,
  path: string[],
): TreeNode[] {
  const fullLineIds: string[] = [...path];

  let cursor = chapter.nodes[fullLineIds[fullLineIds.length - 1] ?? chapter.rootId];
  while (cursor && cursor.children.length > 0) {
    const kids = childNodes(chapter, cursor.id);
    const nextChild = kids.find((k) => k.isMainline) ?? kids[0];
    if (!nextChild) break;
    fullLineIds.push(nextChild.id);
    cursor = nextChild;
  }

  return fullLineIds
    .map((id) => chapter.nodes[id])
    .filter((n): n is TreeNode => Boolean(n && n.move));
}