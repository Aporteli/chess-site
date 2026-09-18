import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { importPgn } from "@/lib/chess";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (typeof body.pgn !== "string" || !body.pgn.trim()) {
      return NextResponse.json(
        { error: "PGN is required." },
        { status: 400 },
      );
    }

    const chapters = importPgn(body.pgn, "Imported");

    const playableChapters = chapters.filter(
      (chapter) => Object.keys(chapter.nodes).length > 1,
    );

    if (!playableChapters.length) {
      return NextResponse.json(
        { error: "No playable chapters found." },
        { status: 400 },
      );
    }

    const repertoire = await prisma.repertoire.create({
      data: {
        userId: session.user.id,
        name: body.name ?? "Lichess Study",
        side: body.side ?? "white",
        description: body.description ?? "",
        chapters: {
          create: playableChapters.map((chapter) => ({
            id: chapter.id,
            name: chapter.name,
            eco: chapter.eco,
            variation: chapter.variation,
            rootId: chapter.rootId,
            startFen: chapter.startFen,
            nodes: chapter.nodes as unknown as Prisma.InputJsonValue,
            createdAt: new Date(chapter.createdAt),
            updatedAt: new Date(chapter.updatedAt),
          })),
        },
      },
      include: {
        chapters: true,
      },
    });

    return NextResponse.json(repertoire, { status: 201 });
  } catch (error) {
    console.error("Lichess Study import failed:", error);

    return NextResponse.json(
      { error: "Lichess Study import failed." },
      { status: 500 },
    );
  }
}