import type { TreeNode } from "@/lib/chess";

/**
 * ერთი სვლის ნომერი (turn) ხის ჯაჭვში.
 * White / Black — ძირითადი ხაზის სვლები, Siblings — ალტერნატივები.
 */
export type TurnRow = {
  turnNumber: number;
  white?: TreeNode;
  whiteParentFen?: string;
  whiteSiblings?: TreeNode[];
  black?: TreeNode;
  blackParentFen?: string;
  blackSiblings?: TreeNode[];
};