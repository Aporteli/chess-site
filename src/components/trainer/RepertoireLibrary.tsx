"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Trash2, Upload } from "lucide-react";
import { collectTrainable, isDue, nodeCount } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";
import { PgnDialog } from "./PgnDialog";

export function RepertoireLibrary() {
  const t = useTrainer();
  const [pgn, setPgn] = useState(false);
  const [name, setName] = useState("");
  const [side, setSide] = useState<"white" | "black">("white");

  return (
    <div className="mx-auto max-w-[1100px] p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent-gold/70">Library</p>
          <h1 className="font-serif-display text-[28px] font-medium text-text-primary">
            Courses & repertoire
          </h1>
          <p className="mt-1 max-w-xl text-[13.5px] text-text-secondary">
            Distinct White and Black files, each with branching chapters. Open a file to author
            the tree or drill it with spaced repetition.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPgn(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-3 py-2 text-[13px] text-text-secondary hover:text-accent-gold-bright"
          >
            <Upload className="h-3.5 w-3.5" />
            Import PGN
          </button>
          <button
            onClick={t.resetToSeed}
            className="rounded-lg border border-border-default px-3 py-2 text-[13px] text-text-muted hover:text-text-secondary"
          >
            Restore demo files
          </button>
        </div>
      </div>

      <form
        className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-border-subtle bg-bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          t.createRepertoire(name.trim(), side);
          setName("");
        }}
      >
        <label className="min-w-[200px] flex-1 text-[11px] text-text-muted">
          New repertoire
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. White — 1.d4 systems"
            className="mt-1 w-full rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 text-[13px] text-text-primary outline-none focus:border-accent-gold/40"
          />
        </label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "white" | "black")}
          className="rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 text-[13px] text-text-secondary"
        >
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2 text-[13px] font-semibold text-[#241a10]"
        >
          <Plus className="h-3.5 w-3.5" />
          Create
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {t.store.repertoires.map((rep) => {
          const moves = rep.chapters.reduce((s, ch) => s + nodeCount(ch), 0);
          const due = rep.chapters.reduce(
            (s, ch) => s + collectTrainable(ch, rep.side).filter((n) => isDue(n.srs)).length,
            0,
          );
          return (
            <article
              key={rep.id}
              className="rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-panel"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-md border border-border-default px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-text-muted">
                    {rep.side}
                  </span>
                  <h2 className="mt-2 font-serif-display text-[20px] text-text-primary">
                    {rep.name}
                  </h2>
                  <p className="mt-1 text-[13px] text-text-secondary">{rep.description || "Custom file"}</p>
                </div>
                <button
                  onClick={() => t.deleteRepertoire(rep.id)}
                  disabled={t.store.repertoires.length <= 1}
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
                {rep.chapters.map((ch) => (
                  <li
                    key={ch.id}
                    className="flex items-center justify-between rounded-lg bg-bg-elevated/60 px-2.5 py-1.5 text-[13px]"
                  >
                    <span className="text-text-primary">
                      {ch.eco && (
                        <span className="mr-2 font-mono text-[10.5px] text-accent-gold/80">{ch.eco}</span>
                      )}
                      {ch.name}
                    </span>
                    <span className="font-mono text-[10.5px] text-text-muted">{nodeCount(ch)}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/trainer"
                onClick={() => t.selectRepertoire(rep.id)}
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-gold-bright hover:underline"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Open in trainer
              </Link>
            </article>
          );
        })}
      </div>

      <PgnDialog open={pgn} mode="import" onClose={() => setPgn(false)} />
    </div>
  );
}
