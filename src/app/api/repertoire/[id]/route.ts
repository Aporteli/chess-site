import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUser } from "@/lib/current-user";
import {
  chapterWriteData,
  parseRepertoireInput,
  toClientRepertoire,
} from "@/lib/repertoire";

type RouteContext = { params: Promise<{ id: string }> };

/** Loads a single repertoire with its chapter trees (used for lazy loading). */
export async function GET(_request: Request, context: RouteContext) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const repertoire = await prisma.repertoire.findFirst({
    where: { id, userId: user.id },
    include: {
      chapters: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!repertoire) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(toClientRepertoire(repertoire));
}

/** Side-only update; safe for repertoires whose chapter trees are not loaded client-side. */
export async function PATCH(request: Request, context: RouteContext) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body: unknown = await request.json();
    const side = (body as { side?: unknown } | null)?.side;
    if (side !== "white" && side !== "black") {
      return NextResponse.json({ error: "Invalid side." }, { status: 400 });
    }

    const existing = await prisma.repertoire.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await prisma.repertoire.update({ where: { id }, data: { side } });

    return NextResponse.json({ id, side });
  } catch (error) {
    console.error("Failed to update repertoire side:", error);
    return NextResponse.json(
      { error: "Failed to update repertoire." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const input = parseRepertoireInput(await request.json());
    if (!input) {
      return NextResponse.json({ error: "Invalid repertoire." }, { status: 400 });
    }

    const existing = await prisma.repertoire.findUnique({ where: { id } });
    if (existing && existing.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const repertoire = await prisma.$transaction(async (tx) => {
      const saved = existing
        ? await tx.repertoire.update({
            where: { id },
            data: {
              name: input.name,
              side: input.side,
              description: input.description,
            },
          })
        : await tx.repertoire.create({
            data: {
              id,
              userId: user.id,
              name: input.name,
              side: input.side,
              description: input.description,
            },
          });

      if (input.chapters) {
        const current = await tx.chapter.findMany({
          where: { repertoireId: id },
          select: { id: true },
        });
        const incomingIds = new Set(input.chapters.map((chapter) => chapter.id));
        const removed = current.filter((chapter) => !incomingIds.has(chapter.id)).map((chapter) => chapter.id);
        if (removed.length > 0) {
          await tx.chapter.deleteMany({
            where: { id: { in: removed }, repertoireId: id },
          });
        }

        for (const chapter of input.chapters) {
          const data = chapterWriteData(chapter);
          await tx.chapter.upsert({
            where: { id: chapter.id },
            create: { ...data, repertoireId: saved.id },
            update: {
              name: data.name,
              eco: data.eco,
              variation: data.variation,
              rootId: data.rootId,
              startFen: data.startFen,
              nodes: data.nodes,
              updatedAt: data.updatedAt,
            },
          });
        }
      }

      return tx.repertoire.findUniqueOrThrow({
        where: { id: saved.id },
        include: {
          chapters: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
    });

    return NextResponse.json(toClientRepertoire(repertoire));
  } catch (error) {
    console.error("Failed to update repertoire:", error);
    return NextResponse.json(
      { error: "Failed to update repertoire." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.repertoire.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await prisma.repertoire.delete({ where: { id } });
    return NextResponse.json({ deleted: 1 });
  } catch (error) {
    console.error("Failed to delete repertoire:", error);
    return NextResponse.json(
      { error: "Failed to delete repertoire." },
      { status: 500 },
    );
  }
}
