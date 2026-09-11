import { getNode, mainlineChild, pathSans, sortedChildren } from "../tree/tree-navigation";
import type { Chapter } from "../types";

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

function formatExportLine(sans: string[]): string {
  const parts: string[] = [];
  sans.forEach((san, i) => {
    if (i % 2 === 0) parts.push(`${Math.floor(i / 2) + 1}. ${san}`);
    else parts.push(san);
  });
  return parts.join(" ");
}

export function currentLinePgn(chapter: Chapter, nodeId: string): string {
  return formatExportLine(pathSans(chapter, nodeId));
}