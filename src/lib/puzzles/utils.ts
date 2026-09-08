import { Chess } from "chess.js";

export function toUci(from: string, to: string, promo?: string): string {
  return `${from}${to}${promo ?? ""}`.toLowerCase();
}
