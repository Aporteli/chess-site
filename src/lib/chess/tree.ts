import type { Move } from "chess.js";
import { chessFromFen, fenTurn, fullFen, normalizeFen, playSan, START_FEN } from "./fen";
import { uid } from "./ids";
import { EVAL_FROM_NAG, type EvalLabel } from "./nags";
import { newSrsCard } from "./srs";
import type { Chapter, Repertoire, StoredMove, TreeNode } from "./types";

export function emptyChapter(
  name: string,
  opts?: { eco?: string; variation?: string; startFen?: string },
): Chapter {
  const startFen = fullFen(opts?.startFen ?? START_FEN);
  const rootId = uid("n");
  const now = Date.now();
  const root: TreeNode = {
    id: rootId,
    parentId: null,
    fen: startFen,
    ply: 0,
    move: null,
    nags: [],
    comment: "",
    annotation: "",
    eval: null,
    isMainline: true,
    weight: 1,
    children: [],
    srs: newSrsCard(now),
  };
  return {
    id: uid("ch"),
    name,
    eco: opts?.eco ?? "",
    variation: opts?.variation ?? "",
    rootId,
    startFen,
    nodes: { [rootId]: root },
    createdAt: now,
    updatedAt: now,
  };
}

export function getNode(chapter: Chapter, id: string): TreeNode {
  const node = chapter.nodes[id];
  if (!node) throw new Error(`Unknown node ${id}`);
  return node;
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

export function formatLine(sans: string[]): string {
  const parts: string[] = [];
  for (let i = 0; i < sans.length; i++) {
    const moveNumber = Math.floor(i / 2) + 1;
    if (i % 2 === 0) parts.push(`${moveNumber}. ${sans[i]}`);
    else parts.push(sans[i]);
  }
  return parts.join(" ");
}

export function moveFromChess(move: Move): StoredMove {
  return {
    san: move.san,
    from: move.from,
    to: move.to,
    promotion: move.promotion,
    uci: `${move.from}${move.to}${move.promotion ?? ""}`,
    captured: move.captured,
    flags: {
      capture: move.isCapture(),
      ep: move.isEnPassant(),
      castle: move.isKingsideCastle()
        ? "k"
        : move.isQueensideCastle()
          ? "q"
          : null,
      promotion: move.isPromotion(),
      check: move.san.includes("+") || move.san.includes("#"),
      mate: move.san.includes("#"),
    },
  };
}

export function childBySan(chapter: Chapter, parentId: string, san: string): TreeNode | undefined {
  return getNode(chapter, parentId).children
    .map((id) => getNode(chapter, id))
    .find((n) => n.move?.san === san);
}

export function addSanMove(
  chapter: Chapter,
  parentId: string,
  san: string,
  extras?: Partial<Pick<TreeNode, "nags" | "comment" | "annotation" | "eval" | "weight" | "isMainline">>,
): { chapter: Chapter; node: TreeNode; created: boolean } {
  const existing = childBySan(chapter, parentId, san);
  if (existing) {
    return { chapter, node: existing, created: false };
  }

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
  nextNodes[parentId] = {
    ...parent,
    children: [...parent.children, node.id],
  };

  return {
    chapter: { ...chapter, nodes: nextNodes, updatedAt: now },
    node,
    created: true,
  };
}

function inferEval(nags: number[]): EvalLabel | null {
  for (const nag of nags) {
    const ev = EVAL_FROM_NAG[nag];
    if (ev) return ev;
  }
  return null;
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
    nodes: {
      ...chapter.nodes,
      [nodeId]: { ...node, ...patch },
    },
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
    getNode(chapter, id).children.forEach((c) => stack.push(c));
  }

  const nodes = { ...chapter.nodes };
  for (const id of doomed) delete nodes[id];

  const parent = nodes[node.parentId];
  if (parent) {
    const children = parent.children.filter((id) => !doomed.has(id));
    const nextParent = { ...parent, children };
    if (node.isMainline && children.length) {
      const first = nodes[children[0]];
      if (first) nodes[children[0]] = { ...first, isMainline: true };
    }
    nodes[node.parentId] = nextParent;
  }

  return {
    chapter: { ...chapter, nodes, updatedAt: Date.now() },
    focusId: node.parentId,
  };
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
    children: [nodeId, ...parent.children.filter((id) => id !== nodeId)],
  };
  return { ...chapter, nodes, updatedAt: Date.now() };
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

export function mainlineChild(chapter: Chapter, nodeId: string): TreeNode | undefined {
  const node = getNode(chapter, nodeId);
  const marked = node.children
    .map((id) => getNode(chapter, id))
    .find((c) => c.isMainline);
  if (marked) return marked;
  if (node.children[0]) return getNode(chapter, node.children[0]);
  return undefined;
}

export function weightedChild(chapter: Chapter, nodeId: string): TreeNode | undefined {
  const kids = getNode(chapter, nodeId).children.map((id) => getNode(chapter, id));
  if (!kids.length) return undefined;
  const total = kids.reduce((s, k) => s + Math.max(0.05, k.weight), 0);
  let roll = Math.random() * total;
  for (const kid of kids) {
    roll -= Math.max(0.05, kid.weight);
    if (roll <= 0) return kid;
  }
  return kids[kids.length - 1];
}

/** Direct child nodes of `nodeId`, in stored order — siblings at this position. */
export function childNodes(chapter: Chapter, nodeId: string): TreeNode[] {
  return getNode(chapter, nodeId)
    .children.map((id) => chapter.nodes[id])
    .filter((n): n is TreeNode => Boolean(n));
}

/** Equal-probability pick among every sibling reply at this node. */
export function randomChild(chapter: Chapter, nodeId: string): TreeNode | undefined {
  const kids = childNodes(chapter, nodeId);
  if (kids.length === 0) return undefined;
  return kids[Math.floor(Math.random() * kids.length)];
}

/** Every root-to-leaf path starting at `nodeId` (ids include `nodeId`). */
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

/**
 * One complete training line from `fromId` to a leaf.
 * If `avoidLeafId` is set and other lines exist, that leaf is skipped so
 * Start Training does not repeat the variation you just walked.
 */
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

/** Follow the chosen drill line; if it is missing, fall back to a random child. */
/** Opponent picks purely at random among all valid responses at this node */
export function pickOpponentReply(
  chapter: Chapter,
  nodeId: string,
  _line?: string[],
): TreeNode | undefined {
  return randomChild(chapter, nodeId);
}

export function isTrainable(node: TreeNode, side: "white" | "black"): boolean {
  if (!node.move) return false;
  const mover = fenTurn(node.fen) === "w" ? "black" : "white";
  return mover === side;
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

export function reconstructSans(chapter: Chapter, nodeId: string): string[] {
  return pathSans(chapter, nodeId);
}

export function chessAt(chapter: Chapter, nodeId: string) {
  return chessFromFen(getNode(chapter, nodeId).fen);
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

export function sortedChildren(chapter: Chapter, nodeId: string): TreeNode[] {
  const kids = getNode(chapter, nodeId).children.map((id) => getNode(chapter, id));
  return kids.sort((a, b) => {
    if (a.isMainline !== b.isMainline) return a.isMainline ? -1 : 1;
    return (b.weight ?? 0) - (a.weight ?? 0);
  });
}

/** აბრუნებს ყველა ფოთლის (ბოლო სვლების) ID-ს, რომელიც ამ კვანძიდან იშლება */
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

/** 
 * ირჩევს მოწინააღმდეგის პასუხს მხოლოდ იმ შტოებიდან, 
 * რომლებშიც ჯერ კიდევ არის დარჩენილი გაუვლელი ფოთლები.
 */
export function pickUnvisitedOpponentReply(
  chapter: Chapter,
  nodeId: string,
  completedLeaves: Set<string>,
): TreeNode | undefined {
  const kids = childNodes(chapter, nodeId);
  if (kids.length === 0) return undefined;

  // ვფილტრავთ იმ ბავშვებს, რომელთა ქვეშაც კიდევ არის გაუვლელი ფოთლები
  const viableKids = kids.filter((kid) => {
    const leaves = getLeafIdsUnder(chapter, kid.id);
    return leaves.some((leafId) => !completedLeaves.has(leafId));
  });

  // თუ ყველა გავლილია (ნაკლებად მოსალოდნელი), ჩვეულებრივად აირჩიოს რანდომი
  const pool = viableKids.length > 0 ? viableKids : kids;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * პოულობს უახლოეს წინაპარ კვანძს (Deepest Ancestor Branch),
 * რომელსაც კიდევ აქვს დარჩენილი გაუვლელი შტოები.
 */
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

    // ვამოწმებთ, აქვს თუ არა ამ კვანძს გაუვლელი შტო
    const leaves = getLeafIdsUnder(chapter, currentId);
    const hasUnvisited = leaves.some((id) => !completedLeaves.has(id));

    if (hasUnvisited) {
      return currentId;
    }

    currentId = node.parentId;
  }

  return null;
}
