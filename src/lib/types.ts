// src/lib/types.ts
// Central domain types. Kept engine-agnostic on purpose — the real chess
// logic (chess.js / custom engine, Stockfish workers, PGN parsers) plugs
// in behind these shapes later without the UI layer needing to change.

export type Side = "white" | "black";

export type MoveStatus = "correct" | "mistake" | "alternative" | "pending";

export interface NotationMove {
  /** Full move number, e.g. 1, 2, 3 */
  moveNumber: number;
  white?: string;
  black?: string;
  /** ply index into the line, used to highlight the active move */
  whitePly: number;
  blackPly?: number;
}

export interface OpeningMeta {
  name: string;
  variation: string;
  eco: string;
  side: Side;
  repertoireLabel: string; // breadcrumb, e.g. "Repertoire / White"
}

export interface SrsState {
  level: number; // 0-8 mastery ladder
  maxLevel: number;
  nextReviewInDays: number;
  streakDays: number;
  accuracyPct: number;
}

export interface TrainerPrompt {
  side: Side;
  text: string;
  kind: "question" | "success" | "error" | "info";
}

export type NavKey =
  | "trainer"
  | "puzzles"
  | "analysis"
  | "courses"
  | "profile"
  | "settings";

export interface NavItem {
  key: NavKey;
  label: string;
  comingSoon?: boolean;
}
