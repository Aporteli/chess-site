import { playSan, START_FEN } from "./fen";
import { EVAL_FROM_NAG, parseNagToken } from "./nags";
import { addSanMove, emptyChapter, getNode, mainlineChild, pathSans, sortedChildren } from "./tree";
import type { Chapter } from "./types";

type Token =
  | { kind: "header"; key: string; value: string }
  | { kind: "move"; san: string }
  | { kind: "nag"; code: number }
  | { kind: "comment"; text: string }
  | { kind: "lparen" }
  | { kind: "rparen" }
  | { kind: "result"; value: string };

interface ParsedMove {
  san: string;
  nags: number[];
  comment: string;
  variations: ParsedMove[][];
}

export interface ParsedGame {
  headers: Record<string, string>;
  moves: ParsedMove[];
}

const SAN_RE =
  /^(?:O-O-O|O-O|0-0-0|0-0|[NBRQK][a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?|[a-h]x[a-h][1-8](?:=[NBRQnbrq])?|[a-h][1-8](?:=[NBRQnbrq])?)(?:[+#])?$/;

const RESULT_RE = /^(?:1-0|0-1|1\/2-1\/2|\*)$/;

function tokenize(pgn: string): Token[] {
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

    if (ch === "(") {
      tokens.push({ kind: "lparen" });
      i += 1;
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "rparen" });
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

    const glyphTrail = word.match(
      /^(.*?)(!{1,2}|\?{1,2}|!\?|\?!|=|\+\/-|-|\+\/\+\/-)$/,
    );
    let san = word;
    let trailingNag: number | null = null;
    if (glyphTrail && SAN_RE.test(glyphTrail[1]!)) {
      san = glyphTrail[1]!;
      trailingNag = parseNagToken(glyphTrail[2]!);
    }

    if (SAN_RE.test(san) || SAN_RE.test(san.replace(/0-0-0/g, "O-O-O").replace(/0-0/g, "O-O"))) {
      tokens.push({
        kind: "move",
        san: san.replace(/0-0-0/g, "O-O-O").replace(/0-0/g, "O-O"),
      });
      if (trailingNag !== null) tokens.push({ kind: "nag", code: trailingNag });
      i = j;
      continue;
    }

    i = j;
  }

  return tokens;
}

function parseSequence(tokens: Token[], start: number): { moves: ParsedMove[]; next: number } {
  const moves: ParsedMove[] = [];
  let i = start;

  const last = () => moves[moves.length - 1];

  while (i < tokens.length) {
    const tok = tokens[i]!;
    if (tok.kind === "rparen" || tok.kind === "result" || tok.kind === "header") break;

    if (tok.kind === "lparen") {
      const inner = parseSequence(tokens, i + 1);
      if (last()) last()!.variations.push(inner.moves);
      i = inner.next;
      if (tokens[i]?.kind === "rparen") i += 1;
      continue;
    }

    if (tok.kind === "move") {
      moves.push({ san: tok.san, nags: [], comment: "", variations: [] });
      i += 1;
      continue;
    }

    if (tok.kind === "nag" && last()) {
      last()!.nags.push(tok.code);
      i += 1;
      continue;
    }

    if (tok.kind === "comment") {
      if (last()) {
        last()!.comment = last()!.comment
          ? `${last()!.comment} ${tok.text}`
          : tok.text;
      }
      i += 1;
      continue;
    }

    i += 1;
  }

  return { moves, next: i };
}

export function parsePgn(pgn: string): ParsedGame[] {
  const tokens = tokenize(pgn);
  const games: ParsedGame[] = [];
  let i = 0;

  while (i < tokens.length) {
    const headers: Record<string, string> = {};
    while (tokens[i]?.kind === "header") {
      const h = tokens[i] as Extract<Token, { kind: "header" }>;
      headers[h.key] = h.value;
      i += 1;
    }
    const { moves, next } = parseSequence(tokens, i);
    i = next;
    if (tokens[i]?.kind === "result") i += 1;
    if (Object.keys(headers).length || moves.length) {
      games.push({ headers, moves });
    }
    while (i < tokens.length && tokens[i]?.kind !== "header" && tokens[i]?.kind !== "move") {
      i += 1;
    }
  }

  return games;
}

function applySequence(chapter: Chapter, parentId: string, moves: ParsedMove[]): Chapter {
  let current = chapter;
  let parent = parentId;
  for (const move of moves) {
    try {
      playSan(getNode(current, parent).fen, move.san);
    } catch {
      break;
    }
    const evalLabel = move.nags.map((n) => EVAL_FROM_NAG[n]).find(Boolean) ?? null;
    const added = addSanMove(current, parent, move.san, {
      nags: move.nags,
      comment: move.comment,
      eval: evalLabel ?? null,
    });
    current = added.chapter;
    for (const variation of move.variations) {
      current = applySequence(current, parent, variation);
    }
    parent = added.node.id;
  }
  return current;
}

export function chapterFromGame(game: ParsedGame, fallbackName: string): Chapter {
  const startFen = game.headers.FEN || game.headers.Fen || START_FEN;
  const name =
    game.headers.Opening ||
    game.headers.White ||
    game.headers.Event ||
    fallbackName;
  let chapter = emptyChapter(name, {
    eco: game.headers.ECO ?? "",
    variation: game.headers.Variation ?? game.headers.Black ?? "",
    startFen,
  });
  if (game.moves[0] && !game.moves[0].comment && game.headers.Annotator) {
    chapter = {
      ...chapter,
      nodes: {
        ...chapter.nodes,
        [chapter.rootId]: {
          ...chapter.nodes[chapter.rootId]!,
          comment: `Annotator: ${game.headers.Annotator}`,
        },
      },
    };
  }
  return applySequence(chapter, chapter.rootId, game.moves);
}

export function importPgn(pgn: string, fallbackName = "Imported line"): Chapter[] {
  return parsePgn(pgn).map((game, i) =>
    chapterFromGame(game, game.headers.Opening ? fallbackName : `${fallbackName} ${i + 1}`),
  );
}

function emitNags(nags: number[]): string {
  if (!nags.length) return "";
  return " " + nags.map((n) => `$${n}`).join(" ");
}

function emitComment(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return ` {${trimmed.replace(/[{}]/g, "")}}`;
}

function emitSequence(
  chapter: Chapter,
  startId: string,
  blackFirst: boolean,
  omitSiblings = false,
): string {
  const parts: string[] = [];
  let id: string | undefined = startId;
  let forceNumber = blackFirst;
  let skipSiblings = omitSiblings;

  while (id) {
    const node = getNode(chapter, id);
    if (!node.move) {
      id = mainlineChild(chapter, id)?.id;
      continue;
    }
    const isWhite = node.ply % 2 === 1;
    const moveNo = Math.ceil(node.ply / 2);
    if (isWhite) parts.push(`${moveNo}. ${node.move.san}`);
    else if (forceNumber) parts.push(`${moveNo}... ${node.move.san}`);
    else parts.push(node.move.san);
    forceNumber = false;
    parts[parts.length - 1] += emitNags(node.nags) + emitComment(node.comment);

    if (!skipSiblings && node.parentId) {
      const siblings = sortedChildren(chapter, node.parentId).filter((c) => c.id !== node.id);
      for (const alt of siblings) {
        const altIsBlack = alt.ply % 2 === 0;
        parts.push(`(${emitSequence(chapter, alt.id, altIsBlack, true).trim()})`);
      }
    }
    skipSiblings = false;
    id = mainlineChild(chapter, node.id)?.id;
  }

  return parts.join(" ");
}

export function exportChapterPgn(chapter: Chapter, extraHeaders?: Record<string, string>): string {
  const headers: Record<string, string> = {
    Event: "MoveTrainer Repertoire",
    Site: "MoveTrainer",
    Date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    Round: "-",
    White: extraHeaders?.White ?? chapter.name,
    Black: extraHeaders?.Black ?? (chapter.variation || "*"),
    Result: "*",
    ECO: chapter.eco || "?",
    Opening: chapter.name,
    Variation: chapter.variation,
    ...extraHeaders,
  };
  const headerBlock = Object.entries(headers)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `[${k} "${v}"]`)
    .join("\n");
  const body = emitSequence(chapter, chapter.rootId, false).trim();
  return `${headerBlock}\n\n${body || ""} *\n`;
}

export function exportRepertoirePgn(
  name: string,
  side: string,
  chapters: Chapter[],
): string {
  return chapters
    .map((ch) =>
      exportChapterPgn(ch, {
        White: side === "white" ? name : "Opponent",
        Black: side === "black" ? name : "Opponent",
      }),
    )
    .join("\n");
}

export function currentLinePgn(chapter: Chapter, nodeId: string): string {
  return formatExportLine(pathSans(chapter, nodeId));
}

function formatExportLine(sans: string[]): string {
  const parts: string[] = [];
  sans.forEach((san, i) => {
    if (i % 2 === 0) parts.push(`${Math.floor(i / 2) + 1}. ${san}`);
    else parts.push(san);
  });
  return parts.join(" ");
}
