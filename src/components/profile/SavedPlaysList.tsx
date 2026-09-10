import Link from "next/link";

interface Play {
  id: string;
  title: string | null;
  result: string;
  source: string;
  createdAt: Date;
  pgn: string | null;
}

interface SavedPlaysListProps {
  plays: Play[];
}

export function SavedPlaysList({ plays }: SavedPlaysListProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-panel">
      <div className="border-b border-border-subtle px-5 py-4 sm:px-7">
        <h2 className="font-serif-display text-lg text-text-primary">
          Saved plays
        </h2>
        <p className="mt-1 text-[13px] text-text-secondary">
          Games you save from Analysis appear here.
        </p>
      </div>
      {plays.length === 0 ? (
        <p className="px-5 py-6 text-[13.5px] text-text-muted sm:px-7">
          No plays yet. Open Analysis, make some moves, then click Save play.
        </p>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {plays.map((play) => (
            <li key={play.id} className="px-5 py-4 sm:px-7">
              <Link
                href={`/analysis?play=${play.id}`}
                className="text-[14px] text-accent-gold-bright hover:underline"
              >
                {play.title || "Untitled play"}
              </Link>
              <p className="mt-1 font-mono text-[11px] text-text-muted">
                {play.result} · {play.source} · {play.createdAt.toLocaleString()}
              </p>
              {play.pgn ? (
                <p className="mt-1.5 truncate font-mono text-[11px] text-text-secondary">
                  {play.pgn}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}