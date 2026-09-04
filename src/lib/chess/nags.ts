export interface NagDef {
  code: number;
  glyph: string;
  label: string;
  kind: "move" | "eval" | "novelty" | "other";
}

export const NAGS: NagDef[] = [
  { code: 1, glyph: "!", label: "Good move", kind: "move" },
  { code: 2, glyph: "?", label: "Mistake", kind: "move" },
  { code: 3, glyph: "!!", label: "Brilliant", kind: "move" },
  { code: 4, glyph: "??", label: "Blunder", kind: "move" },
  { code: 5, glyph: "!?", label: "Interesting", kind: "move" },
  { code: 6, glyph: "?!", label: "Dubious", kind: "move" },
  { code: 7, glyph: "□", label: "Forced", kind: "move" },
  { code: 8, glyph: "□", label: "Singular", kind: "move" },
  { code: 10, glyph: "=", label: "Equal", kind: "eval" },
  { code: 13, glyph: "∞", label: "Unclear", kind: "eval" },
  { code: 14, glyph: "⩲", label: "White slightly better", kind: "eval" },
  { code: 15, glyph: "⩱", label: "Black slightly better", kind: "eval" },
  { code: 16, glyph: "±", label: "White better", kind: "eval" },
  { code: 17, glyph: "∓", label: "Black better", kind: "eval" },
  { code: 18, glyph: "+−", label: "White winning", kind: "eval" },
  { code: 19, glyph: "−+", label: "Black winning", kind: "eval" },
  { code: 22, glyph: "⊕", label: "Zugzwang", kind: "eval" },
  { code: 32, glyph: "↑", label: "Development advantage", kind: "eval" },
  { code: 36, glyph: "→", label: "Initiative", kind: "eval" },
  { code: 40, glyph: "↑↑", label: "Attack", kind: "eval" },
  { code: 44, glyph: "=/∞", label: "Compensation", kind: "eval" },
  { code: 132, glyph: "N", label: "Novelty", kind: "novelty" },
  { code: 140, glyph: "Δ", label: "With the idea", kind: "other" },
  { code: 142, glyph: "∇", label: "Better is", kind: "other" },
  { code: 145, glyph: "RR", label: "Editorial comment", kind: "other" },
  { code: 146, glyph: "N", label: "Novelty", kind: "novelty" },
];

const BY_CODE = new Map(NAGS.map((n) => [n.code, n]));
const BY_GLYPH = new Map(
  NAGS.filter((n) => n.kind === "move" || n.kind === "eval").map((n) => [
    n.glyph,
    n,
  ]),
);

export const MOVE_NAGS = NAGS.filter((n) => n.kind === "move" && n.code <= 6);

export function nagGlyph(code: number): string {
  return BY_CODE.get(code)?.glyph ?? `$${code}`;
}

export function nagLabel(code: number): string {
  return BY_CODE.get(code)?.label ?? `NAG ${code}`;
}

export function parseNagToken(raw: string): number | null {
  if (raw.startsWith("$")) {
    const n = Number(raw.slice(1));
    return Number.isFinite(n) ? n : null;
  }
  return BY_GLYPH.get(raw)?.code ?? null;
}

export function formatNags(codes: number[]): string {
  return codes.map(nagGlyph).join("");
}

export type EvalLabel =
  | "equal"
  | "unclear"
  | "white-slight"
  | "white-clear"
  | "white-decisive"
  | "black-slight"
  | "black-clear"
  | "black-decisive"
  | "compensation";

export const EVAL_NAG: Record<EvalLabel, number> = {
  equal: 10,
  unclear: 13,
  "white-slight": 14,
  "black-slight": 15,
  "white-clear": 16,
  "black-clear": 17,
  "white-decisive": 18,
  "black-decisive": 19,
  compensation: 44,
};

export const EVAL_FROM_NAG: Partial<Record<number, EvalLabel>> = {
  10: "equal",
  13: "unclear",
  14: "white-slight",
  15: "black-slight",
  16: "white-clear",
  17: "black-clear",
  18: "white-decisive",
  19: "black-decisive",
  44: "compensation",
};

export const EVAL_LABELS: { id: EvalLabel; glyph: string; label: string }[] = [
  { id: "equal", glyph: "=", label: "Equal" },
  { id: "unclear", glyph: "∞", label: "Unclear" },
  { id: "white-slight", glyph: "⩲", label: "White slight" },
  { id: "white-clear", glyph: "±", label: "White better" },
  { id: "white-decisive", glyph: "+−", label: "White winning" },
  { id: "black-slight", glyph: "⩱", label: "Black slight" },
  { id: "black-clear", glyph: "∓", label: "Black better" },
  { id: "black-decisive", glyph: "−+", label: "Black winning" },
  { id: "compensation", glyph: "=/∞", label: "Compensation" },
];
