"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTrainer } from "@/lib/trainer/context";
import { nodeCount } from "@/lib/chess";

export function RepertoireBar() {
  const t = useTrainer();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="hidden rounded-xl border border-border-subtle bg-bg-surface p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-serif-display text-[13px] text-text-secondary">Repertoire</h3>
        <button
          onClick={() => setCreating((v) => !v)}
          className="grid h-6 w-6 place-items-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-accent-gold-bright"
          aria-label="New repertoire"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {creating && (
        <form
          className="mb-2 flex gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            t.createRepertoire(name.trim(), t.repertoire.side);
            setName("");
            setCreating(false);
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="min-w-0 flex-1 rounded-md border border-border-default bg-bg-elevated px-2 py-1 text-[12px] text-text-primary outline-none focus:border-accent-gold/50"
          />
          <button
            type="submit"
            className="rounded-md bg-accent-gold px-2 text-[11px] font-semibold text-[#241a10]"
          >
            Add
          </button>
        </form>
      )}

      <div className="flex flex-col gap-1">
        {t.store.repertoires.map((rep) => (
          <button
            key={rep.id}
            onClick={() => t.selectRepertoire(rep.id)}
            className={[
              "flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
              rep.id === t.repertoire.id
                ? "border-accent-gold/25 bg-accent-gold-dim text-accent-gold-bright"
                : "border-transparent text-text-secondary hover:bg-bg-elevated",
            ].join(" ")}
          >
            <span className="truncate">{rep.name}</span>
            <span className="ml-2 shrink-0 font-mono text-[10px] uppercase text-text-muted">
              {rep.side[0]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 border-t border-border-subtle pt-2">
        <div className="mb-1.5 flex items-center justify-between">
          <h3 className="font-serif-display text-[13px] text-text-secondary">Chapters</h3>
          <button
            onClick={() => {
              const title = window.prompt("Chapter name", "New chapter");
              if (title?.trim()) t.createChapter(title.trim());
            }}
            className="grid h-6 w-6 place-items-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-accent-gold-bright"
            aria-label="New chapter"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex max-h-36 flex-col gap-1 overflow-y-auto thin-scrollbar">
          {t.repertoire.chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => t.selectChapter(ch.id)}
              className={[
                "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                ch.id === t.chapter.id
                  ? "bg-bg-elevated text-text-primary ring-1 ring-accent-teal/30"
                  : "text-text-secondary hover:bg-bg-elevated/70",
              ].join(" ")}
            >
              <span className="min-w-0">
                <span className="block truncate">{ch.name}</span>
                {ch.eco && (
                  <span className="font-mono text-[10px] text-accent-gold/70">{ch.eco}</span>
                )}
              </span>
              <span className="ml-2 font-mono text-[10px] text-text-muted">
                {nodeCount(ch)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
