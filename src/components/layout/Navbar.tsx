"use client";

import { useState } from "react";
import { ChevronRight, Menu, SlidersHorizontal } from "lucide-react";
import { openingMeta as fallbackMeta } from "@/lib/mock-data";
import { useTrainerOptional } from "@/lib/trainer/context";

interface NavbarProps {
  onOpenMobileNav: () => void;
}

export function Navbar({ onOpenMobileNav }: NavbarProps) {
  const trainer = useTrainerOptional();
  const meta = trainer?.openingMeta ?? fallbackMeta;
  const crumbs = [
    meta.repertoireLabel.split(" / ")[0],
    meta.side === "white" ? "White" : "Black",
    meta.variation ? `${meta.name}: ${meta.variation}` : meta.name,
  ];
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-surface/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0 flex-1 overflow-hidden">
          <ol className="flex items-baseline gap-1.5 overflow-hidden text-[13px] text-text-secondary">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={`${crumb}-${i}`} className="flex min-w-0 items-baseline gap-1.5">
                  {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 self-center text-accent-gold/50" />}
                  <span
                    className={
                      isLast
                        ? "truncate font-serif-display text-[15px] italic text-text-primary"
                        : "hidden shrink-0 tracking-wide sm:inline"
                    }
                  >
                    {crumb}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        {trainer && (
          <span className="hidden rounded-full border border-border-default px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-text-muted md:inline">
            {trainer.mode === "study" ? "Study" : "Drill"}
          </span>
        )}

        <div className="relative">
          <button
            aria-label="Board settings"
            onClick={() => setSettingsOpen((v) => !v)}
            className="hidden shrink-0 items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-teal/40 hover:text-text-primary sm:flex"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Board
          </button>
          {settingsOpen && trainer && (
            <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-border-default bg-bg-surface p-3 shadow-panel">
              {(
                [
                  ["sound", "Sounds"],
                  ["legalHints", "Legal hints"],
                  ["animations", "Animations"],
                  ["coordinates", "Coordinates"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center justify-between py-1 text-[12.5px] text-text-secondary"
                >
                  {label}
                  <input
                    type="checkbox"
                    className="accent-[#c9a256]"
                    checked={trainer.settings[key]}
                    onChange={(e) => trainer.setSettings({ [key]: e.target.checked })}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          aria-label="Open profile menu"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent-gold/30 bg-gradient-to-br from-accent-teal-dim to-accent-gold-dim font-serif-display text-[13px] font-medium text-accent-gold-bright transition-colors hover:border-accent-gold/60"
        >
          GT
        </button>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />
    </header>
  );
}
