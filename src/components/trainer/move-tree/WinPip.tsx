import { lookupMaster } from "@/lib/chess";

export function WinPip({ fen, san }: { fen: string; san: string }) {
  const stat = lookupMaster(fen)?.moves.find((m) => m.san === san);
  if (!stat) return null;
  return (
    <span
      title={`W: ${stat.whiteWinPct}% | D: ${stat.drawPct}% | B: ${stat.blackWinPct}%`}
      className="inline-flex h-1.5 w-8 shrink-0 overflow-hidden rounded-full bg-bg-deepest"
    >
      <span className="bg-accent-gold" style={{ width: `${stat.whiteWinPct}%` }} />
      <span className="bg-text-muted" style={{ width: `${stat.drawPct}%` }} />
      <span className="bg-accent-garnet" style={{ width: `${stat.blackWinPct}%` }} />
    </span>
  );
}
