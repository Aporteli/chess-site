import Link from "next/link";
import { X } from "lucide-react";

interface SidebarBrandProps {
  collapsed: boolean;
  onCloseMobile: () => void;
}

export function SidebarBrand({ collapsed, onCloseMobile }: SidebarBrandProps) {
  return (
    <div
      className={[
        "flex h-16 items-center gap-2 ",
        collapsed ? "justify-between px-4 lg:justify-center lg:px-2" : "justify-between px-4",
      ].join(" ")}
    >
      <Link href="/" className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-accent-gold/30 bg-gradient-to-br from-accent-gold-dim to-bg-elevated text-accent-gold-bright">
          <span className="font-serif-display text-lg leading-none">♞</span>
        </span>
        <span
          className={[
            "truncate font-serif-display text-[17px] font-medium tracking-tight text-text-primary",
            collapsed ? "lg:hidden" : "",
          ].join(" ")}
        >
          MoveTrainer
        </span>
      </Link>
      <button
        onClick={onCloseMobile}
        aria-label="Close navigation"
        className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated lg:hidden"
      >
        <X className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}