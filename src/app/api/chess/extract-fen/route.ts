import { NextRequest, NextResponse } from "next/server";
import { tryParseFen } from "@/lib/chess/fen";
import { gridToFen } from "@/lib/chess/fen";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const MODEL = "gemini-3.6-flash";

const PROMPT = `You are reading a chess diagram.

Return ONLY an 8x8 grid of the board from White's perspective (rank 8 on the first line, rank 1 on the last).
Each line must be exactly 8 characters using only: K Q R B N P k q r b n p .
Dot (.) means empty square.
No spaces, no FEN, no explanation, no markdown.

Example:
rnbqkbnr
pppppppp
........
........
........
........
PPPPPPPP
RNBQKBNR`;

function parseGrid(raw: string): string[] | null {
  const lines = raw
    .replace(/```/g, "")
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, ""))
    .filter((line) => /^[KQRBNPkqrbnp.]{8}$/.test(line));

  return lines.length === 8 ? lines.slice(0, 8) : null;
}

function geminiErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as { error?: { message?: string } }).error;
    if (err?.message) return err.message;
  }
  return `Chess recognition failed (${status})`;
}

function textFromGemini(data: unknown): string {
  const candidates =
    data && typeof data === "object" && "candidates" in data
      ? ((
          data as {
            candidates?: {
              content?: { parts?: { text?: string; thought?: boolean }[] };
            }[];
          }
        ).candidates ?? [])
      : [];

  const parts = candidates[0]?.content?.parts ?? [];
  return parts
    .filter((part) => !part.thought)
    .map((part) => part.text ?? "")
    .join(" ")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from .env" },
        { status: 500 },
      );
    }

    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "No image was uploaded" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "No image was uploaded" },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 8 MB" },
        { status: 400 },
      );
    }

    const mimeType = file.type || "image/png";
    if (!ALLOWED_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: "Use a PNG, JPG, WEBP, or GIF screenshot" },
        { status: 400 },
      );
    }

    const base64Image = Buffer.from(await file.arrayBuffer()).toString(
      "base64",
    );

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType, data: base64Image } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 8192,
          },
        }),
      },
    );

    const data: unknown = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: geminiErrorMessage(data, res.status) },
        { status: 502 },
      );
    }

    const rawText = textFromGemini(data);
    const rows = parseGrid(rawText);
    const fen = rows ? gridToFen(rows) : tryParseFen(rawText); // fallback if model still returns FEN

    if (!fen) {
      return NextResponse.json(
        {
          error:
            "Could not read a chess board from that image. Try a tighter crop.",
          raw: rawText.slice(0, 500),
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ fen });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Recognition failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
