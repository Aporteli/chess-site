"use client";

import { useState } from "react";
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

  return (
    <div className="min-h-dvh bg-bg-deepest lg:h-dvh lg:overflow-hidden">
      <Sidebar
        activeKey={activeKey}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div
        className={[
          "flex min-h-dvh flex-col transition-[padding] duration-200 ease-out lg:h-full lg:min-h-0",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]",
        ].join(" ")}
      >
        <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
