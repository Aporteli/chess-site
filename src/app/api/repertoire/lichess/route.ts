import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { importPgn } from "@/lib/chess";
import { Prisma } from "@/generated/prisma";

type LichessStudySummary = {
  id: string;
  name: string;
  chapterCount: number;
};

function parseStudyList(raw: string): LichessStudySummary[] {
  const studies: LichessStudySummary[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }

    if (typeof parsed !== "object" || parsed === null) continue;

    const id = "id" in parsed && typeof parsed.id === "string" ? parsed.id : "";
    const name =
      "name" in parsed && typeof parsed.name === "string" ? parsed.name : "";

    if (!id || !name) continue;

    studies.push({
      id,
      name,
      chapterCount:
        "chapters" in parsed && Array.isArray(parsed.chapters)
          ? parsed.chapters.length
          : 0,
    });
  }

  return studies;
}

async function requireLichessToken() {
  const token = process.env.LICHESS_TOKEN;
  if (!token) {
    return {
      token: null,
      error: NextResponse.json(
        { error: "LICHESS_TOKEN is not configured." },
        { status: 500 },
      ),
    };
  }

  return { token, error: null };
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username =
    new URL(request.url).searchParams.get("username")?.trim() ?? "";

  if (!username) {
    return NextResponse.json(
      { error: "Username is required." },
      { status: 400 },
    );
  }

  const { token, error } = await requireLichessToken();
  if (!token) return error;

  const response = await fetch(
    `https://lichess.org/api/study/by/${encodeURIComponent(username)}`,
    {
      headers: {
        Accept: "application/x-ndjson",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `Lichess returned ${response.status}.` },
      { status: response.status },
    );
  }

  const studies = parseStudyList(await response.text());
  return NextResponse.json({ studies });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const record = typeof body === "object" && body !== null ? body : {};

    const username =
      "username" in record && typeof record.username === "string"
        ? record.username.trim()
        : "";

    const studyId =
      "studyId" in record && typeof record.studyId === "string"
        ? record.studyId.trim()
        : "";

    if (!studyId) {
      return NextResponse.json(
        { error: "Study ID is required." },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { name: session.user.name ?? undefined },
      create: {
        email: session.user.email,
        name: session.user.name ?? null,
        password: "",
      },
    });

    const { token, error } = await requireLichessToken();
    if (!token) return error;

    const response = await fetch(
      `https://lichess.org/api/study/${studyId}.pgn`,
      {
        headers: {
          Accept: "application/x-chess-pgn",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Lichess returned ${response.status}.` },
        { status: response.status },
      );
    }

    const pgn = await response.text();

    const chapters = importPgn(pgn, "Lichess Study");

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
        userId: dbUser.id,
        name: playableChapters[0]?.name || "Lichess Study",
        side: "white",
        description: username
          ? `Imported from Lichess study ${studyId} (${username})`
          : `Imported from Lichess study ${studyId}`,
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

    return NextResponse.json({ pgn, repertoire }, { status: 201 });
  } catch (error) {
    console.error("Lichess import failed:", error);

    return NextResponse.json(
      { error: "Lichess import failed." },
      { status: 500 },
    );
  }
}
