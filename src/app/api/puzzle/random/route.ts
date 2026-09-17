
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const lastPuzzle = await prisma.puzzle.findFirst({
      orderBy: {
        seq: "desc",
      },
      select: {
        seq: true,
      },
    });

    if (!lastPuzzle) {
      return NextResponse.json(
        { error: "No puzzles found" },
        { status: 404 },
      );
    }

    const randomSeq = Math.floor(Math.random() * lastPuzzle.seq) + 1;

    const puzzle = await prisma.puzzle.findFirst({
      where: {
        seq: {
          gte: randomSeq,
        },
      },
      orderBy: {
        seq: "asc",
      },
    });

    if (!puzzle) {
      return NextResponse.json(
        { error: "Puzzle not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Failed to fetch random puzzle:", error);

    return NextResponse.json(
      { error: "Failed to fetch random puzzle" },
      { status: 500 },
    );
  }
}

