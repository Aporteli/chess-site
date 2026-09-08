import { cva, type VariantProps } from "@/lib/tablebase/utils";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 font-medium transition-[opacity,transform,box-shadow] duration-(--motion-quick) ease-(--ease-out) disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:opacity-90",
        secondary:
          "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        ghost: "text-muted hover:bg-elevated hover:text-fg",
        danger:
          "text-danger shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger)_40%,transparent)] hover:shadow-[inset_0_0_0_1px_var(--color-danger)]",
        gold: "bg-elevated text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)] hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]",
      },
      size: {
        sm: "h-9 min-h-9 rounded-sm px-3 text-xs",
        md: "h-11 min-h-11 rounded-md px-4 text-sm",
        icon: "size-11 min-h-11 rounded-sm",
        tiny: "h-9 min-h-9 min-w-9 rounded-sm px-2 text-micro",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type, ...props }: Props) {
  return (
    <button
      type={type ?? "button"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
