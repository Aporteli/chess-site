'use client';

import Link from "next/link";
import type { NavKey } from "@/lib/types";

interface NavItemData {
  key: NavKey;
  label: string;
  comingSoon?: boolean;
}

interface SidebarNavItemProps {
  item: NavItemData;
  activeKey: NavKey;
  collapsed: boolean;
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onCloseMobile: () => void;
}

export function SidebarNavItem({
  item,
  activeKey,
  collapsed,
  href,
  icon: Icon,
  onCloseMobile,
}: SidebarNavItemProps) {
  const isActive = item.key === activeKey;
  const disabled = item.comingSoon || !href;

  const content = (
    <>
      <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-[#769656]' : 'text-[#A0A0A0]'}`} strokeWidth={2} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.comingSoon && (
        <span className="ml-auto shrink-0 rounded-full border border-[#383838] bg-[#2A2A2A] px-1.5 py-0.5 text-[10px] font-semibold text-[#A0A0A0]">
          Soon
        </span>
      )}
    </>
  );

  const baseClasses = [
    "flex w-full items-center gap-3 rounded-lg border transition-colors font-mono",
    // Responsive padding: larger on mobile (touch-friendly), smaller on desktop
    "px-3 py-2.5 sm:px-3 sm:py-2.5 lg:px-3 lg:py-2",
    "text-[13.5px] font-medium",
    collapsed ? "justify-center" : "",
    isActive
      ? "border-[#4A7C59] bg-[#4A7C59]/20 text-white font-semibold"
      : disabled
        ? "cursor-not-allowed border-transparent text-[#A0A0A0]/40"
        : "border-transparent text-[#A0A0A0] hover:border-[#383838] hover:bg-[#2A2A2A] hover:text-white",
  ].join(" ");

  return (
    <div className="group relative">
      {isActive && (
        <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#769656]" />
      )}

      {disabled ? (
        <button disabled title={collapsed ? item.label : undefined} className={baseClasses}>
          {content}
        </button>
      ) : (
        <Link
          href={href!}
          onClick={onCloseMobile}
          title={collapsed ? item.label : undefined}
          className={baseClasses}
        >
          {content}
        </Link>
      )}

      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-[#383838] bg-[#1E1E1E] px-2 py-1 font-mono text-xs text-white opacity-0 shadow-2xl transition-opacity group-hover:opacity-100">
          {item.label}
          {item.comingSoon ? " · Soon" : ""}
        </span>
      )}
    </div>
  );
}