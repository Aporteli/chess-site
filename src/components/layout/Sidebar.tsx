"use client";

import Link from "next/link";
import {
  Swords,
  Puzzle,
  ScanSearch,
  Library,
  Settings,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { navItems, secondaryNavItems } from "@/lib/mock-data";
import type { NavKey } from "@/lib/types";

const HREF: Partial<Record<NavKey, string>> = {
  trainer: "/trainer",
  puzzles: "/puzzles",
  analysis: "/analysis",
  courses: "/courses",
  profile: "/profile",
};

const ICONS: Record<NavKey, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  trainer: Swords,
  puzzles: Puzzle,
  analysis: ScanSearch,
  courses: Library,
  settings: Settings,
  profile: UserRound,
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
        {/* Brand row */}
        <div className="flex h-16 items-center justify-between gap-2 border-b border-border-subtle px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-accent-gold/30 bg-gradient-to-br from-accent-gold-dim to-bg-elevated text-accent-gold-bright">
              <span className="font-serif-display text-lg leading-none">♞</span>
            </span>
            {!collapsed && (
              <span className="truncate font-serif-display text-[17px] font-medium tracking-tight text-text-primary">
                MoveTrainer
              </span>
            )}
          </Link>
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated lg:hidden"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 space-y-1  px-3 py-4 ">
          {navItems.map((item) => {
            const Icon = ICONS[item.key];
            const isActive = item.key === activeKey;
            const disabled = item.comingSoon;
            return (
              <div key={item.key} className="group relative">
                {isActive && (
                  <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent-gold" />
                )}
                {disabled || !HREF[item.key] ? (
                  <button
                    disabled={disabled}
                    title={collapsed ? item.label : undefined}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                      collapsed ? "justify-center" : "",
                      isActive
                        ? "border-accent-gold/20 bg-accent-gold-dim text-accent-gold-bright"
                        : "cursor-not-allowed border-transparent text-text-muted",
                    ].join(" ")}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && disabled && (
                      <span className="ml-auto shrink-0 rounded-full border border-border-default bg-bg-elevated px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
                        Soon
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={HREF[item.key]!}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                      collapsed ? "justify-center" : "",
                      isActive
                        ? "border-accent-gold/20 bg-accent-gold-dim text-accent-gold-bright"
                        : "border-transparent text-text-secondary hover:border-border-default hover:bg-bg-elevated hover:text-text-primary",
                    ].join(" ")}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                )}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border-default bg-bg-elevated px-2 py-1 text-xs text-text-primary opacity-0 shadow-panel transition-opacity group-hover:opacity-100">
                    {item.label}
                    {disabled ? " · Soon" : ""}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapsed}
          className="mx-3 mb-2 hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-muted hover:bg-bg-elevated hover:text-text-secondary lg:flex"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Bottom-pinned account / settings */}
        <div className="space-y-1 border-t border-border-subtle px-3 py-3">
          {secondaryNavItems.map((item) => {
            const Icon = ICONS[item.key];
            const isActive = item.key === activeKey;
            const href = HREF[item.key];
            const className = [
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-[13.5px] font-medium transition-colors",
              collapsed ? "justify-center" : "",
              isActive
                ? "border-accent-gold/20 bg-accent-gold-dim text-accent-gold-bright"
                : href
                  ? "border-transparent text-text-secondary hover:border-border-default hover:bg-bg-elevated hover:text-text-primary"
                  : "cursor-not-allowed border-transparent text-text-muted",
            ].join(" ");

            return (
              <div key={item.key} className="group relative">
                {isActive && (
                  <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent-gold" />
                )}
                {href ? (
                  <Link
                    href={href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={className}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                ) : (
                  <button
                    disabled
                    title={collapsed ? item.label : undefined}
                    className={className}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
