import Link from "next/link";
import { PlayCircle, ChevronRight, FileCode2, History } from "lucide-react";

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
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 sm:px-7">
        <div className="flex items-center gap-2.5">
          <History className="h-5 w-5 text-accent-gold" />
          <div>
            <h2 className="font-mono text-lg font-medium text-text-primary">
              Saved Plays
            </h2>
            <p className="text-[12.5px] text-text-secondary">
              Your analyzed games and saved positions
            </p>
          </div>
        </div>
        <span className="rounded-full border border-border-subtle bg-bg-elevated px-2.5 py-1 font-mono text-xs text-text-muted">
          {plays.length} Total
        </span>
      </div>

      {plays.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-7">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl border border-border-default bg-bg-elevated text-text-muted">
            <PlayCircle className="h-6 w-6" />
          </div>
          <h3 className="font-mono text-base font-medium text-text-primary">
            No saved plays yet
          </h3>
          <p className="mt-1 max-w-sm text-[13px] text-text-secondary">
            Analyze your games, test different moves, and save them here to review later.
          </p>
          <Link
            href="/analysis"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-gold px-4 py-2 font-mono text-xs font-medium text-bg-surface transition-colors hover:bg-accent-gold-bright"
          >
            Go to Analysis
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {plays.map((play) => (
            <li
              key={play.id}
              className="group px-5 py-4 transition-colors hover:bg-bg-elevated/40 sm:px-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/analysis?play=${play.id}`}
                    className="inline-flex items-center gap-1.5 font-medium text-[15px] text-text-primary transition-colors hover:text-accent-gold"
                  >
                    <span className="truncate">{play.title || "Untitled play"}</span>
                    <ChevronRight className="h-4 w-4 text-accent-gold opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px]">
                    <span className="rounded border border-border-subtle bg-bg-elevated px-2 py-0.5 font-mono text-text-secondary">
                      {play.result}
                    </span>
                    <span className="text-text-muted">•</span>
                    <span className="capitalize text-text-secondary">{play.source}</span>
                    <span className="text-text-muted">•</span>
                    <span className="font-mono text-text-muted">
                      {new Date(play.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {play.pgn && (
                    <div className="mt-2 flex max-w-xl items-center gap-1.5 rounded-lg border border-border-subtle/50 bg-bg-elevated/60 px-2.5 py-1.5 font-mono text-[11.5px] text-text-muted">
                      <FileCode2 className="h-3.5 w-3.5 shrink-0 text-accent-gold/70" />
                      <p className="truncate">{play.pgn}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}