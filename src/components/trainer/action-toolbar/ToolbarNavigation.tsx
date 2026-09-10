"use client";

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

interface ToolbarNavigationProps {
  onGoStart: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoEnd: () => void;
}

export function ToolbarNavigation({
  onGoStart,
  onGoBack,
  onGoForward,
  onGoEnd,
}: ToolbarNavigationProps) {
  const navItems = [
    { icon: ChevronsLeft, label: "Go to start", run: onGoStart },
    { icon: ChevronLeft, label: "Previous move", run: onGoBack },
    { icon: ChevronRight, label: "Next move", run: onGoForward },
    { icon: ChevronsRight, label: "Go to end", run: onGoEnd },
  ];

  return (
    <div className="mt-3 flex items-center justify-center gap-0.5 rounded-lg border border-border-subtle bg-bg-elevated/60 p-1">
      {navItems.map(({ icon: Icon, label, run }) => (
        <button
          key={label}
          aria-label={label}
          onClick={run}
          className="grid h-9 flex-1 place-items-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated-hover hover:text-accent-gold-bright active:scale-95"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}