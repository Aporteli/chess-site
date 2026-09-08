import type { EndgamePieces } from "./types";

export const ENDGAME_CONFIGS = {
  KP_K: { white: ["k", "p"], black: ["k"] },
  KR_K: { white: ["k", "r"], black: ["k"] },
  KQ_K: { white: ["k", "q"], black: ["k"] },
  KBB_K: { white: ["k", "b", "b"], black: ["k"] },
  KBN_K: { white: ["k", "b", "n"], black: ["k"] },
  KRB_K: { white: ["k", "r", "b"], black: ["k"] },
  KQ_KR: { white: ["k", "q"], black: ["k", "r"] },
  KRP_KR: { white: ["k", "r", "p"], black: ["k", "r"] },
  KRPP_KR: { white: ["k", "r", "p", "p"], black: ["k", "r"] },
} as const;

export type BuiltinKind = keyof typeof ENDGAME_CONFIGS;

export const ENDGAME_IDS = Object.keys(ENDGAME_CONFIGS) as BuiltinKind[];

export function isBuiltinKind(kind: string): kind is BuiltinKind {
  return kind in ENDGAME_CONFIGS;
}

export function builtinPieces(kind: string): EndgamePieces | undefined {
  return ENDGAME_CONFIGS[kind as BuiltinKind];
}
