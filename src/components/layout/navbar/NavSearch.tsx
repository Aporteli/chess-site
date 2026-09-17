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
        className="flex w-full max-w-[240px] items-center gap-2 rounded-lg border border-[#383838] bg-[#2A2A2A] px-2.5 py-1.5 text-left text-[13px] font-medium text-[#A0A0A0] transition-colors hover:border-[#769656] hover:text-white sm:px-3"
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-[#A0A0A0]" />
        <span className="hidden truncate sm:inline">Search</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-2 w-[min(calc(100vw-2rem),20rem)] rounded-xl border border-[#383838] bg-[#1E1E1E] p-2 shadow-2xl md:left-auto md:right-0">
          <div className="flex items-center gap-2 rounded-lg border border-[#383838] bg-[#2A2A2A] px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#A0A0A0]" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) goTo(results[0].href);
              }}
              placeholder="Go to a page…"
              className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[#A0A0A0]"
            />
          </div>
          <ul className="mt-1.5 max-h-56 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-2.5 py-2 text-[12.5px] text-[#A0A0A0]">No matches</li>
            ) : (
              results.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => goTo(item.href)}
                    className="flex w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-white transition-colors hover:bg-[#2A2A2A] hover:text-[#769656]"
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