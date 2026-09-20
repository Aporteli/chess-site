import { Prisma } from "@/generated/prisma";
import { emptyChapter } from "@/lib/chess/tree/chapter-factory";
import type { Chapter } from "@/lib/chess/types";
import type { Side } from "@/lib/types";
import { toMillis } from "@/lib/repertoire-map";

export {
  toClientChapter,
  toClientRepertoire,
  toClientRepertoireSummary,
} from "@/lib/repertoire-map";

function asNodes(value: unknown): Chapter["nodes"] {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Chapter["nodes"];
  }
  return {};
}

export function parseChapterInput(raw: unknown): Chapter | null {
  if (typeof raw !== "object" || raw === null) return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.name !== "string" || !value.name.trim()) return null;
  if (typeof value.rootId !== "string" || !value.rootId) return null;
  if (typeof value.startFen !== "string" || !value.startFen) return null;
  if (typeof value.nodes !== "object" || value.nodes === null) return null;

  const fallback = emptyChapter(value.name.trim());
  return {
    id: typeof value.id === "string" && value.id ? value.id : fallback.id,
    name: value.name.trim(),
    eco: typeof value.eco === "string" ? value.eco : "",
    variation: typeof value.variation === "string" ? value.variation : "",
    rootId: value.rootId,
    startFen: value.startFen,
    nodes: asNodes(value.nodes),
    createdAt: toMillis(
      typeof value.createdAt === "number" || typeof value.createdAt === "string"
        ? value.createdAt
        : fallback.createdAt,
    ),
    updatedAt: toMillis(
      typeof value.updatedAt === "number" || typeof value.updatedAt === "string"
        ? value.updatedAt
        : fallback.updatedAt,
    ),
  };
}

export function parseRepertoireInput(raw: unknown): {
  id?: string;
  name: string;
  side: Side;
  description: string;
  chapters: Chapter[] | undefined;
} | null {
  if (typeof raw !== "object" || raw === null) return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.name !== "string" || !value.name.trim()) return null;
  if (value.side !== "white" && value.side !== "black") return null;

  let chapters: Chapter[] | undefined;
  if (Array.isArray(value.chapters)) {
    chapters = [];
    for (const item of value.chapters) {
      const chapter = parseChapterInput(item);
      if (!chapter) return null;
      chapters.push(chapter);
    }
  }

  return {
    id: typeof value.id === "string" && value.id ? value.id : undefined,
    name: value.name.trim().slice(0, 200),
    side: value.side,
    description: typeof value.description === "string" ? value.description : "",
    chapters,
  };
}

export function chapterWriteData(chapter: Chapter) {
  return {
    id: chapter.id,
    name: chapter.name,
    eco: chapter.eco,
    variation: chapter.variation,
    rootId: chapter.rootId,
    startFen: chapter.startFen,
    nodes: chapter.nodes as unknown as Prisma.InputJsonValue,
    createdAt: new Date(chapter.createdAt),
    updatedAt: new Date(chapter.updatedAt),
  };
}
