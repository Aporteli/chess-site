import { NextRequest, NextResponse } from "next/server";
import { Chess } from "chess.js";
import { fullFen, tryParseFen } from "@/lib/chess/fen";

type Body = { fen?: string; sideToMove?: "w" | "b" };

async function fromLichess(targetSide: "w" | "b") {
  let attempts = 0;
  const maxAttempts = 6;

  while (attempts < maxAttempts) {
    attempts++;
    const res = await fetch("https://lichess.org/api/puzzle/next", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Could not fetch a puzzle from Lichess. Status: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    const chess = new Chess();
    chess.loadPgn(data.game.pgn);
    const history = chess.history({ verbose: true });
    const first = String(data.puzzle.solution?.[0] ?? "").toLowerCase();
    const ply = Number(data.puzzle.initialPly);

    const tryPly = (n: number) => {
      chess.reset();
      for (let i = 0; i < n && i < history.length; i++) chess.move(history[i]);
      if (!first) return true;
      return chess
        .moves({ verbose: true })
        .some(
          (m) => `${m.from}${m.to}${m.promotion ?? ""}`.toLowerCase() === first,
        );
    };

    if (!tryPly(ply) && !tryPly(ply + 1)) tryPly(Math.max(0, ply - 1));

    const currentFen = chess.fen();
    const puzzleSide = currentFen.split(/\s+/)[1];

    // ვაბრუნებთ მხოლოდ მაშინ, როცა Lichess-ის ამოცანის სვლა ემთხვევა მომხმარებლის არჩეულ მხარეს
    if (puzzleSide === targetSide) {
      return {
        fen: currentFen,
        solution: data.puzzle.solution as string[],
        theme: (data.puzzle.themes as string[] | undefined)?.[0] ?? "tactics",
        rating: Number(data.puzzle.rating) || 1500,
      };
    }
  }

  throw new Error(
    `Could not find a puzzle for side '${targetSide}' after several attempts. Please try again.`,
  );
}

async function fromFen(fen: string, side: "w" | "b") {
  const parts = fullFen(fen).split(/\s+/);
  parts[1] = side;
  const start = new Chess(parts.join(" "));
  const q = new URLSearchParams({ fen: start.fen(), multiPv: "1" });
  const res = await fetch(`https://lichess.org/api/cloud-eval?${q}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("No engine eval for this position.");

  const data = await res.json();
  const pv: string = data.pvs?.[0]?.moves ?? "";
  const moves = pv.split(/\s+/).filter(Boolean).slice(0, 6);

  if (!moves.length) throw new Error("No solution line for this position.");

  const cp = data.pvs?.[0]?.cp;
  const mate = data.pvs?.[0]?.mate;

  return {
    fen: start.fen(),
    solution: moves,
    theme: mate != null ? "mate" : "best-move",
    rating:
      mate != null
        ? 1800
        : Math.min(2200, 1200 + Math.abs(Number(cp) || 0) / 2),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const raw = body.fen?.trim() ?? "";
    const side = body.sideToMove === "b" ? "b" : "w";

    if (!raw) {
      return NextResponse.json(await fromLichess(side));
    }

    const parsed = tryParseFen(raw);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid FEN." }, { status: 400 });
    }

    return NextResponse.json(await fromFen(parsed, side));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate puzzle.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}