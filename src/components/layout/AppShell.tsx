"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { Navbar } from "@/components/layout/navbar/Navbar";
import type { NavKey } from "@/lib/types";

interface AppShellProps {
  activeKey: NavKey;
  children: React.ReactNode;
}

export function AppShell({ activeKey, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Below xl the expanded rail costs the board ~170px of width, which is
  // where space is tightest, so default to the icon rail there.
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1279px)");
    const sync = () => setCollapsed(narrow.matches);

    sync();
    narrow.addEventListener("change", sync);
    return () => narrow.removeEventListener("change", sync);
  }, []);

  return (
    // Fixed-height app frame: the viewport never scrolls, `main` does.
    <div className="flex h-dvh flex-col overflow-hidden bg-bg-deepest lg:flex-row">
      {/* Sidebar - in-flow rail on desktop, overlay on mobile */}
      <Sidebar
        activeKey={activeKey}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
