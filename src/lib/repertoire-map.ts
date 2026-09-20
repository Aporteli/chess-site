import type { Chapter, Repertoire, RepertoireSummary } from "@/lib/chess/types";
import type { Side } from "@/lib/types";

function toMillis(value: Date | string | number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : Date.now();
}

function asSide(value: unknown): Side {
  return value === "black" ? "black" : "white";
}

function asNodes(value: unknown): Chapter["nodes"] {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Chapter["nodes"];
  }
  return {};
}

export function toClientChapter(chapter: {
  id: string;
  name: string;
  eco: string;
  variation: string;
  rootId: string;
  startFen: string;
  nodes: unknown;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
}): Chapter {
  return {
    id: chapter.id,
    name: chapter.name,
    eco: chapter.eco,
    variation: chapter.variation,
    rootId: chapter.rootId,
    startFen: chapter.startFen,
    nodes: asNodes(chapter.nodes),
    createdAt: toMillis(chapter.createdAt),
    updatedAt: toMillis(chapter.updatedAt),
  };
}

export function toClientRepertoire(row: {
  id: string;
  name: string;
  side: string;
  description: string;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  chapters: Parameters<typeof toClientChapter>[0][];
}): Repertoire {
  return {
    id: row.id,
    name: row.name,
    side: asSide(row.side),
    description: row.description,
    chapters: row.chapters.map(toClientChapter),
    createdAt: toMillis(row.createdAt),
    updatedAt: toMillis(row.updatedAt),
  };
}

/** Maps a repertoire row that was queried without its chapters (Prisma `_count`). */
export function toClientRepertoireSummary(row: {
  id: string;
  name: string;
  side: string;
  chapterCount: number;
}): RepertoireSummary {
  return {
    id: row.id,
    name: row.name,
    side: asSide(row.side),
    chapterCount: Number.isFinite(row.chapterCount) ? row.chapterCount : 0,
  };
}

export { toMillis };
