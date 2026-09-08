import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({ label, children, className, ...props }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative grid size-11 min-h-11 place-items-center rounded-sm text-muted",
        "shadow-[var(--shadow-border)] transition-[color,box-shadow,transform] duration-(--motion-quick)",
        "hover:text-fg hover:shadow-[var(--shadow-border-hover)] active:scale-95",
        "disabled:opacity-40 after:absolute after:inset-0",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
