// src/lib/mock-data.ts
// Static placeholder data so the UI has believable content to render.
// Replace with real repertoire/SRS/engine data once the backend exists.

import type { NavItem, NotationMove, OpeningMeta, SrsState, TrainerPrompt } from "./types";

export const openingMeta: OpeningMeta = {
  name: "Italian Game",
  variation: "Giuoco Piano, Main Line",
  eco: "C50",
  side: "white",
  repertoireLabel: "Repertoire / White",
};

export const srsState: SrsState = {
  level: 3,
  maxLevel: 8,
  nextReviewInDays: 4,
  streakDays: 12,
  accuracyPct: 87,
};

export const moveHistory: NotationMove[] = [
  { moveNumber: 1, white: "e4", black: "e5", whitePly: 0, blackPly: 1 },
  { moveNumber: 2, white: "Nf3", black: "Nc6", whitePly: 2, blackPly: 3 },
  { moveNumber: 3, white: "Bc4", black: "Bc5", whitePly: 4, blackPly: 5 },
  { moveNumber: 4, white: "c3", whitePly: 6 },
];

/** Ply index currently "active" in the line — drives the highlight. */
export const activePly = 6;

export const trainerPrompt: TrainerPrompt = {
  side: "white",
  kind: "question",
  text: "White to move. What is the main try after 3...Bc5, preparing d4 while keeping the center flexible?",
};

export const navItems: NavItem[] = [
  { key: "trainer", label: "Openings / Trainer" },
  { key: "puzzles", label: "Puzzles", comingSoon: true },
  { key: "analysis", label: "Analysis Board", comingSoon: true },
  { key: "courses", label: "Courses & Repertoire" },
];

export const secondaryNavItems: NavItem[] = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
];

/** 8x8 mock board — placeholder piece placement for the Giuoco Piano tabiya. */
export const mockBoardFEN = "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R";
