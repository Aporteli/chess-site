import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repertoires = await prisma.repertoire.findMany({
    where: { userId: session.user.id },
    include: {
      chapters: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(repertoires);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const repertoire = await prisma.repertoire.create({
      data: {
        userId: session.user.id,
        name: body.name,
        side: body.side,
        description: body.description ?? "",
      },
    });

    return NextResponse.json(repertoire, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create repertoire." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
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
      where: { id: { in: ids }, userId: session.user.id },
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