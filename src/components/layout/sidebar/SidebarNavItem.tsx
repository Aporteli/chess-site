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
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.comingSoon && (
        <span className="ml-auto shrink-0 rounded-full border border-border-default bg-bg-elevated px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
          Soon
        </span>
      )}
    </>
  );

  const baseClasses = [
    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-[13.5px] font-medium transition-colors",
    collapsed ? "justify-center" : "",
    isActive
      ? "border-accent-gold/20 bg-accent-gold-dim text-accent-gold-bright"
      : disabled
        ? "cursor-not-allowed border-transparent text-text-muted"
        : "border-transparent text-text-secondary hover:border-border-default hover:bg-bg-elevated hover:text-text-primary",
  ].join(" ");

  return (
    <div className="group relative">
      {isActive && (
        <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent-gold" />
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
        <span className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border-default bg-bg-elevated px-2 py-1 text-xs text-text-primary opacity-0 shadow-panel transition-opacity group-hover:opacity-100">
          {item.label}
          {item.comingSoon ? " · Soon" : ""}
        </span>
      )}
    </div>
  );
}