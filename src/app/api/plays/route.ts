import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUser } from "@/lib/current-user";

export async function GET(request: Request) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view plays." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (id) {
    const play = await prisma.play.findFirst({
      where: { id, userId: user.id },
    });
    if (!play) {
      return NextResponse.json({ error: "Play not found." }, { status: 404 });
    }
    return NextResponse.json({ play });
  }

  const plays = await prisma.play.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ plays });
}

export async function POST(request: Request) {
  const user = await getDbUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to save a play." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    source?: string;
    white?: string;
    black?: string;
    result?: string;
    pgn?: string;
    startFen?: string;
    currentFen?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const play = await prisma.play.create({
      data: {
        userId: user.id,
        title: body.title?.trim() || null,
        source: body.source?.trim() || "analysis",
        white: body.white?.trim() || null,
        black: body.black?.trim() || null,
        result: body.result?.trim() || "*",
        pgn: body.pgn ?? "",
        startFen:
          body.startFen?.trim() ||
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        currentFen: body.currentFen?.trim() || null,
      },
    });

    return NextResponse.json({ play }, { status: 201 });
  } catch (error) {
    console.error("Failed to save play", error);
    return NextResponse.json(
      { error: "Could not save play. Try again." },
      { status: 500 },
    );
  }
}
