import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUser } from "@/lib/current-user";
import { emptyChapter } from "@/lib/chess/tree/chapter-factory";
import {
  chapterWriteData,
  parseRepertoireInput,
  toClientRepertoire,
  toClientRepertoireSummary,
} from "@/lib/repertoire";

/**
 * Without params this returns the lightweight repertoire index (no node JSON),
 * which is what the app needs to render lists and the trainer's pickers.
 * `?include=chapters` returns the full trees for callers that show library-wide
 * statistics (the Courses page).
 */
export async function GET(request: Request) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const full =
    new URL(request.url).searchParams.get("include") === "chapters";

  if (full) {
    const repertoires = await prisma.repertoire.findMany({
      where: { userId: user.id },
      include: {
        chapters: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(repertoires.map(toClientRepertoire));
  }

  const rows = await prisma.repertoire.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      side: true,
      _count: { select: { chapters: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(
    rows.map((row) =>
      toClientRepertoireSummary({
        id: row.id,
        name: row.name,
        side: row.side,
        chapterCount: row._count.chapters,
      }),
    ),
  );
}

export async function POST(request: Request) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = parseRepertoireInput(await request.json());
    if (!input) {
      return NextResponse.json({ error: "Invalid repertoire." }, { status: 400 });
    }

    const chapters = input.chapters?.length ? input.chapters : [emptyChapter("Main line")];

    const repertoire = await prisma.repertoire.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        userId: user.id,
        name: input.name,
        side: input.side,
        description: input.description,
        chapters: {
          create: chapters.map(chapterWriteData),
        },
      },
      include: {
        chapters: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(toClientRepertoire(repertoire), { status: 201 });
  } catch (error) {
    console.error("Failed to create repertoire:", error);
    return NextResponse.json(
      { error: "Failed to create repertoire." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body?.ids)
      ? body.ids.filter((x: unknown): x is string => typeof x === "string")
      : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: "No ids provided." }, { status: 400 });
    }

    const result = await prisma.repertoire.deleteMany({
      where: { id: { in: ids }, userId: user.id },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    console.error("Delete repertoires failed:", error);
    return NextResponse.json(
      { error: "Failed to delete repertoires." },
      { status: 500 },
    );
  }
}
