import { normalizeFen } from "./fen";
import type { MasterPosition } from "./types";

/**
 * Curated master-book snapshot for the positions that ship in the seed
 * repertoires. Numbers are representative of modern master practice
 * (rough Mega-style frequencies), not a live live-rating feed.
 */
const BOOK: Record<string, MasterPosition> = {
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
    fenKey: "start",
    games: 8_420_000,
    avgElo: 2410,
    moves: [
      { san: "e4", games: 3_790_000, whiteWinPct: 39, drawPct: 32, blackWinPct: 29, avgElo: 2425 },
      { san: "d4", games: 2_940_000, whiteWinPct: 38, drawPct: 36, blackWinPct: 26, avgElo: 2438 },
      { san: "Nf3", games: 980_000, whiteWinPct: 37, drawPct: 38, blackWinPct: 25, avgElo: 2452 },
      { san: "c4", games: 520_000, whiteWinPct: 38, drawPct: 37, blackWinPct: 25, avgElo: 2440 },
    ],
    notable: [
      { white: "Kasparov", black: "Karpov", year: 1985, result: "1-0", event: "World Championship" },
      { white: "Carlsen", black: "Nepomniachtchi", year: 2021, result: "1-0", event: "World Championship" },
    ],
  },
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
    fenKey: "e4",
    games: 3_790_000,
    avgElo: 2425,
    moves: [
      { san: "c5", games: 1_250_000, whiteWinPct: 37, drawPct: 31, blackWinPct: 32, avgElo: 2448 },
      { san: "e5", games: 980_000, whiteWinPct: 39, drawPct: 34, blackWinPct: 27, avgElo: 2410 },
      { san: "e6", games: 420_000, whiteWinPct: 39, drawPct: 33, blackWinPct: 28, avgElo: 2418 },
      { san: "c6", games: 310_000, whiteWinPct: 38, drawPct: 35, blackWinPct: 27, avgElo: 2422 },
    ],
    notable: [
      { white: "Fischer", black: "Spassky", year: 1972, result: "1-0", event: "World Championship" },
    ],
  },
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6": {
    fenKey: "e4e5",
    games: 980_000,
    avgElo: 2410,
    moves: [
      { san: "Nf3", games: 860_000, whiteWinPct: 40, drawPct: 34, blackWinPct: 26, avgElo: 2418 },
      { san: "Nc3", games: 48_000, whiteWinPct: 37, drawPct: 33, blackWinPct: 30, avgElo: 2280 },
      { san: "f4", games: 32_000, whiteWinPct: 41, drawPct: 26, blackWinPct: 33, avgElo: 2260 },
      { san: "Bc4", games: 24_000, whiteWinPct: 38, drawPct: 30, blackWinPct: 32, avgElo: 2240 },
    ],
    notable: [
      { white: "Anand", black: "Gelfand", year: 2012, result: "1/2-1/2", event: "World Championship" },
    ],
  },
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
    fenKey: "e4e5Nf3",
    games: 860_000,
    avgElo: 2418,
    moves: [
      { san: "Nc6", games: 620_000, whiteWinPct: 40, drawPct: 35, blackWinPct: 25, avgElo: 2424 },
      { san: "Nf6", games: 180_000, whiteWinPct: 38, drawPct: 36, blackWinPct: 26, avgElo: 2430 },
      { san: "d6", games: 36_000, whiteWinPct: 43, drawPct: 32, blackWinPct: 25, avgElo: 2290 },
    ],
    notable: [
      { white: "Caruana", black: "Carlsen", year: 2018, result: "1/2-1/2", event: "World Championship" },
    ],
  },
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
    fenKey: "e4e5Nf3Nc6",
    games: 620_000,
    avgElo: 2424,
    moves: [
      { san: "Bb5", games: 310_000, whiteWinPct: 40, drawPct: 37, blackWinPct: 23, avgElo: 2455 },
      { san: "Bc4", games: 145_000, whiteWinPct: 39, drawPct: 33, blackWinPct: 28, avgElo: 2380 },
      { san: "d4", games: 72_000, whiteWinPct: 41, drawPct: 30, blackWinPct: 29, avgElo: 2360 },
      { san: "Nc3", games: 54_000, whiteWinPct: 36, drawPct: 35, blackWinPct: 29, avgElo: 2320 },
    ],
    notable: [
      { white: "Lasker", black: "Capablanca", year: 1921, result: "0-1", event: "World Championship" },
    ],
  },
  "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    fenKey: "italian",
    games: 145_000,
    avgElo: 2380,
    moves: [
      { san: "Bc5", games: 68_000, whiteWinPct: 38, drawPct: 35, blackWinPct: 27, avgElo: 2392 },
      { san: "Nf6", games: 52_000, whiteWinPct: 40, drawPct: 32, blackWinPct: 28, avgElo: 2404 },
      { san: "Be7", games: 9_400, whiteWinPct: 42, drawPct: 36, blackWinPct: 22, avgElo: 2310 },
    ],
    notable: [
      { white: "Nakamura", black: "So", year: 2023, result: "1-0", event: "Norway Chess" },
    ],
  },
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
    fenKey: "giuoco",
    games: 68_000,
    avgElo: 2392,
    moves: [
      { san: "c3", games: 28_000, whiteWinPct: 40, drawPct: 34, blackWinPct: 26, avgElo: 2408 },
      { san: "d3", games: 22_000, whiteWinPct: 37, drawPct: 38, blackWinPct: 25, avgElo: 2415 },
      { san: "O-O", games: 9_200, whiteWinPct: 36, drawPct: 37, blackWinPct: 27, avgElo: 2388 },
      { san: "b4", games: 4_800, whiteWinPct: 43, drawPct: 24, blackWinPct: 33, avgElo: 2320 },
    ],
    notable: [
      { white: "Steinitz", black: "Chigorin", year: 1892, result: "1-0", event: "World Championship" },
      { white: "Carlsen", black: "Anand", year: 2014, result: "1-0", event: "World Championship" },
    ],
  },
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq -": {
    fenKey: "giuoco-c3",
    games: 28_000,
    avgElo: 2408,
    moves: [
      { san: "Nf6", games: 24_200, whiteWinPct: 39, drawPct: 35, blackWinPct: 26, avgElo: 2412 },
      { san: "d6", games: 2_100, whiteWinPct: 44, drawPct: 32, blackWinPct: 24, avgElo: 2280 },
    ],
    notable: [
      { white: "Morphy", black: "Consultants", year: 1858, result: "1-0", event: "Paris Opera" },
    ],
  },
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq -": {
    fenKey: "giuoco-nf6",
    games: 24_200,
    avgElo: 2412,
    moves: [
      { san: "d4", games: 14_800, whiteWinPct: 41, drawPct: 33, blackWinPct: 26, avgElo: 2418 },
      { san: "d3", games: 7_600, whiteWinPct: 36, drawPct: 39, blackWinPct: 25, avgElo: 2402 },
      { san: "O-O", games: 1_200, whiteWinPct: 35, drawPct: 38, blackWinPct: 27, avgElo: 2360 },
    ],
    notable: [
      { white: "Alekhine", black: "Euwe", year: 1937, result: "1-0", event: "World Championship" },
    ],
  },
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
    fenKey: "two-knights",
    games: 52_000,
    avgElo: 2404,
    moves: [
      { san: "d3", games: 21_000, whiteWinPct: 37, drawPct: 38, blackWinPct: 25, avgElo: 2430 },
      { san: "Ng5", games: 18_400, whiteWinPct: 42, drawPct: 27, blackWinPct: 31, avgElo: 2365 },
      { san: "d4", games: 6_200, whiteWinPct: 40, drawPct: 30, blackWinPct: 30, avgElo: 2388 },
    ],
    notable: [
      { white: "Kasparov", black: "Short", year: 1993, result: "1-0", event: "PCA World Championship" },
    ],
  },
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
    fenKey: "sicilian",
    games: 1_250_000,
    avgElo: 2448,
    moves: [
      { san: "Nf3", games: 980_000, whiteWinPct: 37, drawPct: 32, blackWinPct: 31, avgElo: 2456 },
      { san: "Nc3", games: 110_000, whiteWinPct: 36, drawPct: 31, blackWinPct: 33, avgElo: 2380 },
      { san: "c3", games: 72_000, whiteWinPct: 38, drawPct: 30, blackWinPct: 32, avgElo: 2365 },
    ],
    notable: [
      { white: "Kasparov", black: "Topalov", year: 1999, result: "1-0", event: "Wijk aan Zee" },
    ],
  },
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
    fenKey: "sicilian-nf3",
    games: 980_000,
    avgElo: 2456,
    moves: [
      { san: "d6", games: 410_000, whiteWinPct: 38, drawPct: 32, blackWinPct: 30, avgElo: 2460 },
      { san: "Nc6", games: 290_000, whiteWinPct: 37, drawPct: 32, blackWinPct: 31, avgElo: 2452 },
      { san: "e6", games: 180_000, whiteWinPct: 36, drawPct: 33, blackWinPct: 31, avgElo: 2448 },
    ],
    notable: [
      { white: "Fischer", black: "Petrosian", year: 1971, result: "1-0", event: "Candidates" },
    ],
  },
  "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
    fenKey: "najdorf",
    games: 186_000,
    avgElo: 2488,
    moves: [
      { san: "Be3", games: 52_000, whiteWinPct: 39, drawPct: 31, blackWinPct: 30, avgElo: 2502 },
      { san: "Bg5", games: 41_000, whiteWinPct: 40, drawPct: 29, blackWinPct: 31, avgElo: 2474 },
      { san: "Be2", games: 28_000, whiteWinPct: 36, drawPct: 35, blackWinPct: 29, avgElo: 2468 },
      { san: "Bc4", games: 18_000, whiteWinPct: 38, drawPct: 30, blackWinPct: 32, avgElo: 2440 },
      { san: "f3", games: 14_000, whiteWinPct: 38, drawPct: 31, blackWinPct: 31, avgElo: 2455 },
    ],
    notable: [
      { white: "Kasparov", black: "Anand", year: 1995, result: "1-0", event: "World Championship" },
      { white: "Fischer", black: "Reshevsky", year: 1961, result: "1-0", event: "New York" },
    ],
  },
};

export function lookupMaster(fen: string): MasterPosition | null {
  return BOOK[normalizeFen(fen)] ?? null;
}

export function masterMove(fen: string, san: string) {
  const pos = lookupMaster(fen);
  return pos?.moves.find((m) => m.san === san) ?? null;
}

export function formatGames(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10}k`;
  return String(n);
}
