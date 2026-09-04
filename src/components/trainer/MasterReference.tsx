"use client";

import { formatGames } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";

export function MasterReference() {
  const t = useTrainer();
  const book = t.master;
  const repertoireSans = new Set(
    t.node.children
      .map((id) => t.chapter.nodes[id]?.move?.san)
      .filter((s): s is string => Boolean(s)),
  );

  return (
    <div className="hidden rounded-xl border border-border-subtle bg-bg-surface p-4">
      <div className="mb-2.5 flex items-baseline justify-between border-b border-border-subtle pb-2.5">
        <h3 className="font-serif-display text-[15px] text-text-primary">Master book</h3>
        <span className="font-mono text-[10.5px] text-text-muted">
          {book ? `${formatGames(book.games)} games` : "local"}
        </span>
      </div>

      {!book && (
        <p className="text-[12.5px] leading-relaxed text-text-muted">
          No local master snapshot for this position. Popular tabiyas in the seed files
          carry Mega-style frequencies; import more book data later.
        </p>
      )}

      {book && (
        <>
          <p className="mb-2 text-[11px] text-text-muted">
            Avg rating {book.avgElo}
          </p>
          <div className="space-y-1.5">
            {book.moves.map((m) => {
              const inRep = repertoireSans.has(m.san);
              const share = book.games ? Math.round((m.games / book.games) * 100) : 0;
              return (
                <div key={m.san} className="grid grid-cols-[44px_1fr_auto] items-center gap-2">
                  <span
                    className={[
                      "font-mono text-[13px]",
                      inRep ? "text-accent-gold-bright" : "text-text-primary",
                    ].join(" ")}
                  >
                    {m.san}
                  </span>
                  <div>
                    <div className="flex h-1.5 overflow-hidden rounded-full bg-bg-deepest">
                      <span className="bg-accent-gold" style={{ width: `${m.whiteWinPct}%` }} />
                      <span className="bg-text-muted/70" style={{ width: `${m.drawPct}%` }} />
                      <span className="bg-accent-garnet" style={{ width: `${m.blackWinPct}%` }} />
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-text-muted">
                      {share}% · W{m.whiteWinPct} D{m.drawPct} L{m.blackWinPct} · {m.avgElo}
                      {!inRep && (
                        <span className="ml-1 text-accent-garnet-bright">not in file</span>
                      )}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">
                    {formatGames(m.games)}
                  </span>
                </div>
              );
            })}
          </div>
          {book.notable.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-border-subtle pt-2">
              {book.notable.map((g) => (
                <li key={`${g.white}-${g.black}-${g.year}`} className="text-[11.5px] text-text-secondary">
                  <span className="text-text-primary">
                    {g.white}–{g.black}
                  </span>{" "}
                  {g.year} · {g.event} · {g.result}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
