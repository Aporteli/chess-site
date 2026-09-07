import { NextResponse } from "next/server";
import { isLegalChessFen } from "@/lib/chess/endgame-deck";

export interface TablebaseMove {
  uci: string;
  san: string;
  category: "win" | "draw" | "loss" | "maybe-loss" | "unknown";
  dtm: number | null;
  dtz: number | null;
  checkmate: boolean;
  stalemate: boolean;
}

export interface TablebaseResponse {
  category: "win" | "draw" | "loss" | "maybe-loss" | "unknown";
  dtm: number | null;
  dtz: number | null;
  checkmate: boolean;
  stalemate: boolean;
  moves: TablebaseMove[];
}

function countPiecesFromFen(fen: string): number {
  const boardPart = fen.split(" ")[0];
  let count = 0;
  for (const char of boardPart) {
    if (/[pnbrqkPNBRQK]/.test(char)) {
      count++;
    }
  }
  return count;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fen = searchParams.get("fen");

  if (!fen) {
    return NextResponse.json(
      { error: "FEN პარამეტრი აუცილებელია." },
      { status: 400 },
    );
  }

  const pieceCount = countPiecesFromFen(fen);
  if (pieceCount > 7) {
    return NextResponse.json(
      {
        error: `FEN შეიცავს ${pieceCount} ფიგურას. Tablebase მხარს უჭერს მაქსიმუმ 7 ფიგურას.`,
      },
      { status: 400 },
    );
  }
  
  if (!isLegalChessFen(fen)) {
    return NextResponse.json(
      {
        error:
          "Illegal FEN: the side that is not to move is in check. Tablebase only accepts legal positions.",
      },
      { status: 400 },
    );
  }

  try {
    const encodedFen = encodeURIComponent(fen.trim().replace(/ /g, "_"));
    const res = await fetch(
      `https://tablebase.lichess.ovh/standard?fen=${encodedFen}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 }, // ქეშირება 1 საათით
      },
    );

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        {
          error: `Lichess API error: ${res.status} ${body || res.statusText}`,
        },
        { status: res.status },
      );
    }

    const data: TablebaseResponse = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "სერვერთან კავშირი ვერ დამყარდა." },
      { status: 500 },
    );
  }
}
