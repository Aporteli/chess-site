"use client";

import { createContext, createElement, useContext, useEffect, type ReactNode } from "react";
import { useStockfish } from "@/lib/chess/stockfish/use-stockfish";

const StockfishContext = createContext<ReturnType<typeof useStockfish> | null>(
  null,
);

export function StockfishProvider({
  fen,
  children,
}: {
  fen: string;
  children: ReactNode;
}) {
  const engine = useStockfish();

  useEffect(() => {
    engine.evaluatePosition(fen);
  }, [fen, engine.evaluatePosition]);

  return createElement(StockfishContext.Provider, { value: engine }, children);
}

export function useStockfishEngine() {
  const ctx = useContext(StockfishContext);
  if (!ctx)
    throw new Error("useStockfishEngine must be used within StockfishProvider");
  return ctx;
}