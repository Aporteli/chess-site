
export type PuzzleData = {
  id: string;
  seq: number;
  fen: string;
  solution: string[];
  theme: string;
  rating: number;
};

type ApiPuzzle = {
  id: string;
  seq: number;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
};

export async function fetchGeneratedPuzzle(): Promise<PuzzleData> {
  const res = await fetch("/api/puzzle/random", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);

    throw new Error(
      data?.error || "Failed to fetch random puzzle.",
    );
  }

  const data: ApiPuzzle = await res.json();

  return {
    id: data.id,
    seq: data.seq,
    fen: data.fen,
    solution: data.moves.split(" ").filter(Boolean),
    theme: data.themes[0] ?? "unknown",
    rating: data.rating,
  };
}

