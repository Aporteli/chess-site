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
        <span className="grid h-9 w-9 shrink-0 place-items-center ">
          <img
            src="/pawn_1.svg"
            alt="PawnX Logo"
            className="h-9 w-9"
            width={26}
            height={26}
            draggable="false"
          />
    
        </span>
        <span
          className={[
            "truncate font-mono text-[17px] font-medium tracking-tight text-white",
            collapsed ? "lg:hidden" : "",
          ].join(" ")}
        >
          PawnX
        </span>
      </Link>
      <button
        onClick={onCloseMobile}
        aria-label="Close navigation"
        className="rounded-md p-1.5 text-[#A0A0A0] transition-colors hover:bg-[#2A2A2A] hover:text-white lg:hidden"
      >
        <X className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}