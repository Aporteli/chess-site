import { parseNagToken } from "../nags";

export type Token =
  | { kind: "header"; key: string; value: string }
  | { kind: "move"; san: string }
  | { kind: "nag"; code: number }
  | { kind: "comment"; text: string }
  | { kind: "lparen" }
  | { kind: "rparen" }
  | { kind: "result"; value: string };

const SAN_RE =
  /^(?:O-O-O|O-O|0-0-0|0-0|[NBRQK][a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?|[a-h]x[a-h][1-8](?:=[NBRQnbrq])?|[a-h][1-8](?:=[NBRQnbrq])?)(?:[+#])?$/;

const RESULT_RE = /^(?:1-0|0-1|1\/2-1\/2|\*)$/;

export function tokenize(pgn: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const src = pgn.replace(/^\uFEFF/, "");

  const skipSpace = () => {
    while (i < src.length && /\s/.test(src[i]!)) i += 1;
  };

  while (i < src.length) {
    skipSpace();
    if (i >= src.length) break;
    const ch = src[i]!;

    if (ch === "[") {
      const end = src.indexOf("]", i);
      if (end === -1) break;
      const inner = src.slice(i + 1, end);
      const match = inner.match(/^(\w+)\s+"([^"]*)"$/);
      if (match) tokens.push({ kind: "header", key: match[1]!, value: match[2]! });
      i = end + 1;
      continue;
    }

    if (ch === "{") {
      const end = src.indexOf("}", i + 1);
      const text = src.slice(i + 1, end === -1 ? src.length : end).trim();
      tokens.push({ kind: "comment", text });
      i = end === -1 ? src.length : end + 1;
      continue;
    }

    if (ch === ";") {
      const end = src.indexOf("\n", i);
      tokens.push({
        kind: "comment",
        text: src.slice(i + 1, end === -1 ? src.length : end).trim(),
      });
      i = end === -1 ? src.length : end + 1;
      continue;
    }

    if (ch === "(" || ch === ")") {
      tokens.push({ kind: ch === "(" ? "lparen" : "rparen" });
      i += 1;
      continue;
    }

    if (ch === "$") {
      let j = i + 1;
      while (j < src.length && /\d/.test(src[j]!)) j += 1;
      const code = Number(src.slice(i + 1, j));
      if (Number.isFinite(code)) tokens.push({ kind: "nag", code });
      i = j;
      continue;
    }

    let j = i;
    while (j < src.length && !/\s|{|}|\(|\)|\[/.test(src[j]!)) j += 1;
    let word = src.slice(i, j);

    if (/^\d+\.+$/.test(word)) {
      i = j;
      continue;
    }

    const dotted = word.match(/^\d+\.+(.+)$/);
    if (dotted) word = dotted[1]!;

    if (RESULT_RE.test(word)) {
      tokens.push({ kind: "result", value: word });
      i = j;
      continue;
    }

    const nag = parseNagToken(word);
    if (nag !== null && !SAN_RE.test(word)) {
      tokens.push({ kind: "nag", code: nag });
      i = j;
      continue;
    }

    const glyphTrail = word.match(/^(.*?)(!{1,2}|\?{1,2}|!\?|\?!|=|\+\/-|-|\+\/\+\/-)$/);
    let san = word;
    let trailingNag: number | null = null;
    if (glyphTrail && SAN_RE.test(glyphTrail[1]!)) {
      san = glyphTrail[1]!;
      trailingNag = parseNagToken(glyphTrail[2]!);
    }

    const formattedSan = san.replace(/0-0-0/g, "O-O-O").replace(/0-0/g, "O-O");
    if (SAN_RE.test(san) || SAN_RE.test(formattedSan)) {
      tokens.push({ kind: "move", san: formattedSan });
      if (trailingNag !== null) tokens.push({ kind: "nag", code: trailingNag });
      i = j;
      continue;
    }

    i = j;
  }

  return tokens;
}