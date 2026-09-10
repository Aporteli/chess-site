import Link from "next/link";
import { BookOpen, Trash2 } from "lucide-react";
import { collectTrainable, isDue, nodeCount } from "@/lib/chess";

interface RepertoireCardProps {
  rep: any;
  isOnlyOne: boolean;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function RepertoireCard({ rep, isOnlyOne, onDelete, onSelect }: RepertoireCardProps) {
  const moves = rep.chapters.reduce((s: number, ch: any) => s + nodeCount(ch), 0);
  const due = rep.chapters.reduce(
    (s: number, ch: any) =>
      s + collectTrainable(ch, rep.side).filter((n) => isDue(n.srs)).length,
    0,
  );

  return (
    <article className="rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-panel">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <span className="rounded-md border border-border-default px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-text-muted">
            {rep.side}
          </span>
          <h2 className="mt-2 font-serif-display text-[20px] text-text-primary">
            {rep.name}
          </h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            {rep.description || "Custom file"}
          </p>
        </div>
        <button
          onClick={() => onDelete(rep.id)}
          disabled={isOnlyOne}
          className="grid h-8 w-8 place-items-center rounded-md text-text-muted hover:text-accent-garnet-bright disabled:opacity-30"
          aria-label="Delete repertoire"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="font-mono text-[11px] text-text-muted">
        {rep.chapters.length} chapters · {moves} moves · {due} due
      </p>
      <ul className="mt-3 space-y-1">
        {rep.chapters.map((ch: any) => (
          <li
            key={ch.id}
            className="flex items-center justify-between rounded-lg bg-bg-elevated/60 px-2.5 py-1.5 text-[13px]"
          >
            <span className="text-text-primary">
              {ch.eco && (
                <span className="mr-2 font-mono text-[10.5px] text-accent-gold/80">
                  {ch.eco}
                </span>
              )}
              {ch.name}
            </span>
            <span className="font-mono text-[10.5px] text-text-muted">
              {nodeCount(ch)}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/trainer"
        onClick={() => onSelect(rep.id)}
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-gold-bright hover:underline"
      >
        <BookOpen className="h-3.5 w-3.5" />
        Open in trainer
      </Link>
    </article>
  );
}