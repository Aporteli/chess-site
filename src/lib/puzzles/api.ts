export type PuzzleData = {
    fen: string;
    solution: string[];
    theme: string;
    rating: number;
  };
  
  export async function fetchGeneratedPuzzle({
    fen,
    sideToMove,
  }: {
    fen: string;
    sideToMove: "w" | "b";
  }): Promise<PuzzleData> {
    const res = await fetch("/api/puzzle/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen, sideToMove }),
    });
    if (!res.ok) {
      throw new Error((await res.json()).error || "Failed to generate puzzle.");
    }
    return await res.json();
  }