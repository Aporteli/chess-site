"use client";

import React, { RefObject, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useClickOutside } from "@/hooks/navbar/use-click-outside";

const SEARCH_LINKS = [
  { href: "/trainer", label: "Openings / Trainer" },
  { href: "/puzzles", label: "Puzzles" },
  { href: "/analysis", label: "Analysis Board" },
  { href: "/tablebase", label: "Tablebase" },
  { href: "/courses", label: "Courses & Repertoire" },
  { href: "/profile", label: "Profile" },
] as const;

interface NavSearchProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function NavSearch({ isOpen, onToggle, onClose }: NavSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Click outside and ESC key hook
  useClickOutside(searchRef as RefObject<HTMLElement>, isOpen, onClose);

  // Auto focus input when opened
  React.useEffect(() => {
    if (isOpen) searchInputRef.current?.focus();
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_LINKS;
    return SEARCH_LINKS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  const goTo = (href: string) => {
    onClose();
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={searchRef} className="relative min-w-0 md:w-[240px] md:shrink-0">
      <button
        type="button"
        aria-label="Search"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full max-w-[240px] items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-2.5 py-1.5 text-left text-[13px] font-medium text-text-muted transition-colors hover:border-accent-gold/40 hover:text-text-secondary sm:px-3"
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
        <span className="hidden truncate sm:inline">Search</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-2 w-[min(calc(100vw-2rem),20rem)] rounded-xl border border-border-default bg-bg-surface p-2 shadow-panel md:left-auto md:right-0">
          <div className="flex items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-text-muted" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) goTo(results[0].href);
              }}
              placeholder="Go to a page…"
              className="w-full bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>
          <ul className="mt-1.5 max-h-56 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-2.5 py-2 text-[12.5px] text-text-muted">No matches</li>
            ) : (
              results.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => goTo(item.href)}
                    className="flex w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                  >
                    {item.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}