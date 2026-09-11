import { fullFen, START_FEN } from "../fen";
import { uid } from "../ids";
import { newSrsCard } from "../srs/srs-algorithm";
import type { Chapter, TreeNode } from "../types";

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