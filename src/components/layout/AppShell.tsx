"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import type { NavKey } from "@/lib/types";

interface AppShellProps {
  activeKey: NavKey;
  children: React.ReactNode;
}

/**
 * Shared shell for every route in the platform. New sections (Puzzles,
 * Analysis, Courses, Profile) mount inside `children` and automatically
 * inherit the sidebar, breadcrumb bar, and responsive behavior below.
 */
export function AppShell({ activeKey, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg-deepest">
      <Sidebar
        activeKey={activeKey}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div
        className={[
          "flex min-h-dvh flex-col transition-[padding] duration-200 ease-out",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]",
        ].join(" ")}
      >
        <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
