
import type { NavItem, NotationMove, OpeningMeta, SrsState, TrainerPrompt } from "./types";

export const navItems: NavItem[] = [
  { key: "trainer", label: "Openings / Trainer" },
  { key: "puzzles", label: "Puzzles", },
  { key: "analysis", label: "Analysis Board",  },
  { key: "courses", label: "Courses & Repertoire" },
  { key: "tablebase", label: "Tablebase" },
];

export const secondaryNavItems: NavItem[] = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
];

/** 8x8 mock board — placeholder piece placement for the Giuoco Piano tabiya. */
export const mockBoardFEN = "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R";
