import { useState } from "react";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { fetchGeneratedPuzzle } from "@/lib/puzzles/api";
import type { FENSide } from "@/lib/types";

export function useGeneratePuzzle() {
  const [fenInput, setFenInput] = useState("");
  const [sideToMove, setSideToMove] = useState<FENSide>("w");
  const { setPuzzle, loading, setLoading, error, setError } = usePuzzleStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchGeneratedPuzzle({ fen: fenInput, sideToMove });
      setPuzzle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate puzzle.");
    } finally {
      setLoading(false);
    }
  };

  return {
    fenInput,
    setFenInput,
    sideToMove,
    setSideToMove,
    loading,
    error,
    handleSubmit,
  };
}