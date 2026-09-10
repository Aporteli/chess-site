import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarCollapseToggleProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function SidebarCollapseToggle({
  collapsed,
  onToggleCollapsed,
}: SidebarCollapseToggleProps) {
  return (
    <button
      onClick={onToggleCollapsed}
      className={[
        "mx-3 mb-2 hidden items-center gap-2 rounded-lg py-2 text-xs font-medium text-text-muted hover:bg-bg-elevated hover:text-text-secondary lg:flex",
        collapsed ? "justify-center px-2" : "px-3",
      ].join(" ")}
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
  );
}