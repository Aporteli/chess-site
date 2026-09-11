import { playSan } from "../fen";
import { uid } from "../ids";
import { newSrsCard } from "../srs/srs-algorithm";
import type { Chapter, TreeNode } from "../types";
import { childBySan, getNode } from "./tree-navigation";
import { inferEval, moveFromChess } from "./tree-move-utils";

export function addSanMove(
  chapter: Chapter,
  parentId: string,
  san: string,
  extras?: Partial<Pick<TreeNode, "nags" | "comment" | "annotation" | "eval" | "weight" | "isMainline">>,
): { chapter: Chapter; node: TreeNode; created: boolean } {
  const existing = childBySan(chapter, parentId, san);
  if (existing) return { chapter, node: existing, created: false };

  const parent = getNode(chapter, parentId);
  const played = playSan(parent.fen, san);
  const stored = moveFromChess(played);
  const now = Date.now();

  const node: TreeNode = {
    id: uid("n"),
    parentId,
    fen: played.after,
    ply: parent.ply + 1,
    move: stored,
    nags: extras?.nags ?? [],
    comment: extras?.comment ?? "",
    annotation: extras?.annotation ?? "",
    eval: extras?.eval ?? inferEval(extras?.nags ?? []),
    isMainline: extras?.isMainline ?? parent.children.length === 0,
    weight: extras?.weight ?? 1,
    children: [],
    srs: newSrsCard(now),
  };

  const nextNodes = { ...chapter.nodes, [node.id]: node };
  nextNodes[parentId] = { ...parent, children: [...parent.children, node.id] };

  return { 
    chapter: { ...chapter, nodes: nextNodes, updatedAt: now }, 
    node, 
    created: true 
  };
}

export function patchNode(
  chapter: Chapter,
  nodeId: string,
  patch: Partial<Omit<TreeNode, "id" | "parentId" | "children" | "move" | "fen" | "ply">>,
): Chapter {
  const node = getNode(chapter, nodeId);
  return {
    ...chapter,
    updatedAt: Date.now(),
    nodes: { ...chapter.nodes, [nodeId]: { ...node, ...patch } },
  };
}

export function deleteSubtree(chapter: Chapter, nodeId: string): { chapter: Chapter; focusId: string } {
  const node = getNode(chapter, nodeId);
  if (!node.parentId) return { chapter, focusId: nodeId };

  const doomed = new Set<string>();
  const stack = [nodeId];

  while (stack.length) {
    const id = stack.pop()!;
    if (doomed.has(id)) continue;
    doomed.add(id);
    getNode(chapter, id).children.forEach((c: string) => stack.push(c));
  }

  const nodes = { ...chapter.nodes };
  for (const id of doomed) delete nodes[id];

  const parent = nodes[node.parentId];
  if (parent) {
    const children = parent.children.filter((id: string) => !doomed.has(id));
    const nextParent = { ...parent, children };
    
    if (node.isMainline && children.length) {
      const first = nodes[children[0]];
      if (first) nodes[children[0]] = { ...first, isMainline: true };
    }
    nodes[node.parentId] = nextParent;
  }

  return { chapter: { ...chapter, nodes, updatedAt: Date.now() }, focusId: node.parentId };
}

export function promoteMainline(chapter: Chapter, nodeId: string): Chapter {
  const node = getNode(chapter, nodeId);
  if (!node.parentId) return chapter;

  const parent = getNode(chapter, node.parentId);
  const nodes = { ...chapter.nodes };

  for (const childId of parent.children) {
    const child = getNode(chapter, childId);
    nodes[childId] = { ...child, isMainline: childId === nodeId };
  }

  nodes[parent.id] = {
    ...parent,
    children: [nodeId, ...parent.children.filter((id: string) => id !== nodeId)],
  };

  return { ...chapter, nodes, updatedAt: Date.now() };
}