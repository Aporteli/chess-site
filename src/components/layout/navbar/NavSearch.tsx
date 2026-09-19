"use client";

import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
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

  useClickOutside(searchRef as RefObject<HTMLElement>, isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    } else {
      setQuery("");
    }
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
    <div
      ref={searchRef}
      className="relative flex justify-end md:w-[260px] md:shrink-0"
    >
      {/* ── Expanding pill — h-[35px] matches BoardSettingsDropdown ── */}
      <div
        className={[
          "flex h-[35px] items-center overflow-hidden rounded-lg border bg-[#2A2A2A]",
          "transition-[border-color,box-shadow] duration-200 ease-out",
          isOpen
            ? "border-[#769656] shadow-[0_0_0_3px_rgba(118,150,86,0.12)]"
            : "border-[#383838] hover:border-[#769656]",
        ].join(" ")}
      >
        {/* Input — h-full fills pill's content area, no py needed */}
        <input
          ref={searchInputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              onClose();
            }
            if (e.key === "Enter" && results[0]) {
              e.preventDefault();
              goTo(results[0].href);
            }
          }}
          placeholder="Search"
          tabIndex={isOpen ? 0 : -1}
          aria-hidden={!isOpen}
          className={[
            "h-full min-w-0 bg-transparent text-[13px] text-white outline-none",
            "placeholder:text-[#A0A0A0]",
            "transition-[width,padding,opacity] duration-300",
            "ease-[cubic-bezier(0.16,1,0.3,1)]",
            isOpen
              ? "w-[160px] px-2.5 opacity-100 sm:w-[200px] sm:px-3 md:w-[220px]"
              : "w-0 px-0 opacity-0",
          ].join(" ")}
        />

        {/* Trigger — h-full fills pill's content area */}
        <button
          type="button"
          aria-label="Search"
          aria-expanded={isOpen}
          onClick={onToggle}
          className="flex h-full shrink-0 cursor-pointer items-center gap-2 px-2.5 text-[13px] font-medium text-[#A0A0A0] transition-colors hover:text-white sm:px-3"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}