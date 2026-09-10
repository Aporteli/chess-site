"use client";

import {
  Swords,
  Puzzle,
  ScanSearch,
  Library,
  Settings,
  UserRound,
  TableIcon,
} from "lucide-react";
import { navItems, secondaryNavItems } from "@/lib/mock-data";
import type { NavKey } from "@/lib/types";
import { SidebarBrand } from "@/components/layout/sidebar/SidebarBrand";
import { SidebarNavItem } from "@/components/layout/sidebar/SidebarNavItem";
import { SidebarCollapseToggle } from "@/components/layout/sidebar/SidebarCollapseToggle";

const HREF: Partial<Record<NavKey, string>> = {
  trainer: "/trainer",
  puzzles: "/puzzles",
  analysis: "/analysis",
  courses: "/courses",
  profile: "/profile",
  tablebase: "/tablebase",
};

const ICONS: Record<NavKey, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  trainer: Swords,
  puzzles: Puzzle,
  analysis: ScanSearch,
  courses: Library,
  settings: Settings,
  profile: UserRound,
  tablebase: TableIcon,
};

interface SidebarProps {
  activeKey: NavKey;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeKey,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border-subtle bg-bg-surface",
          "transition-[width,transform] duration-200 ease-out",
          collapsed ? "lg:w-[76px]" : "lg:w-[248px]",
          "w-[248px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <SidebarBrand collapsed={collapsed} onCloseMobile={onCloseMobile} />

        {/* Primary nav */}
        <nav
          className={[
            "flex-1 space-y-1 overflow-y-auto px-3 py-4",
            collapsed ? "no-scrollbar" : "",
          ].join(" ")}
        >
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              activeKey={activeKey}
              collapsed={collapsed}
              href={HREF[item.key]}
              icon={ICONS[item.key]}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </nav>

        <SidebarCollapseToggle
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
        />

        <div className="space-y-1 border-t border-border-subtle px-3 py-3">
          {secondaryNavItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              activeKey={activeKey}
              collapsed={collapsed}
              href={HREF[item.key]}
              icon={ICONS[item.key]}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </div>
      </aside>
    </>
  );
}