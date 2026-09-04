import type { EvalLabel } from "./nags";
import type { Side } from "../types";

export type { EvalLabel };

export interface StoredMove {
  san: string;
  from: string;
  to: string;
  promotion?: string;
  uci: string;
  captured?: string;
  flags: {
    capture: boolean;
    ep: boolean;
    castle: "k" | "q" | null;
    promotion: boolean;
    check: boolean;
    mate: boolean;
  };
}

export interface SrsCard {
  ease: number;
  interval: number;
  repetitions: number;
  dueAt: number;
  lapses: number;
  lastResult: "again" | "hard" | "good" | "easy" | null;
  lastReviewedAt: number | null;
  /** Rolling accuracy 0–1 over recent attempts */
  accuracy: number;
  attempts: number;
  correct: number;
  hintUsed: boolean;
}

export interface TreeNode {
  id: string;
  parentId: string | null;
  fen: string;
  ply: number;
  move: StoredMove | null;
  nags: number[];
  comment: string;
  annotation: string;
  eval: EvalLabel | null;
  isMainline: boolean;
  /** Relative weight for opponent-reply sampling (master frequency proxy). */
  weight: number;
  /**
   * IDs of every legal reply from this exact position — siblings, not a flat list.
   * After 2.Nf3 this is [d6, d5, c6, b6], never nodes that belong under 3...h6.
   */
  children: string[];
  srs: SrsCard;
}

export interface Chapter {
  id: string;
  name: string;
  eco: string;
  variation: string;
  rootId: string;
  startFen: string;
  nodes: Record<string, TreeNode>;
  createdAt: number;
  updatedAt: number;
}

export interface Repertoire {
  id: string;
  name: string;
  side: Side;
  description: string;
  chapters: Chapter[];
  createdAt: number;
  updatedAt: number;
}

export interface OpeningStore {
  version: 1;
  repertoires: Repertoire[];
}

export interface MasterGameRef {
  white: string;
  black: string;
  year: number;
  result: "1-0" | "0-1" | "1/2-1/2";
  event: string;
}

export interface MasterMoveStat {
  san: string;
  games: number;
  whiteWinPct: number;
  drawPct: number;
  blackWinPct: number;
  avgElo: number;
}

export interface MasterPosition {
  fenKey: string;
  games: number;
  avgElo: number;
  moves: MasterMoveStat[];
  notable: MasterGameRef[];
}

export type DrillFilter =
  | "due"
  | "weak"
  | "new"
  | "chapter"
  | "repertoire"
  | "blunders";

export interface DrillCard {
  chapterId: string;
  nodeId: string;
  parentId: string;
  reason: DrillFilter;
}

export type TrainerMode = "study" | "drill";
