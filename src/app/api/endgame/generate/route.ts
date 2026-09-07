import { NextResponse } from "next/server";
import {
  ENDGAME_IDS,
  generateEndgameFen,
  isEndgameKind,
} from "@/lib/chess/endgame-deck";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { kind?: string };
    const kind = isEndgameKind(body.kind) ? body.kind : ENDGAME_IDS[0]!;
    const fen = generateEndgameFen(kind);
    if (!fen) {
      return NextResponse.json(
        { error: `Could not generate a legal ${kind} FEN` },
        { status: 422 },
      );
    }
    return NextResponse.json({ fen, kind });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generate failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
