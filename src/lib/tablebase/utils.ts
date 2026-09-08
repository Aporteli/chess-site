import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A basic implementation of a class variance authority (cva) utility for Tailwind CSS.
 * Allows declaration of base classes and variant groups for ergonomically building class names.
 *
 * Usage:
 *   const button = cva("base-classes", {
 *     variants: {
 *       size: { sm: "text-sm", md: "text-base" },
 *       color: { primary: "bg-blue", secondary: "bg-gray" }
 *     },
 *     defaultVariants: { size: "md", color: "primary" }
 *   });
 *
 *   button({ size: "sm", color: "secondary" });
 */
type CVADefinition<
  Variants extends Record<string, Record<string, string>> = any,
  Defaults extends Partial<{ [K in keyof Variants]: keyof Variants[K] }> = any
> = {
  variants?: Variants;
  defaultVariants?: Defaults;
};

/**
 * Type helper for the props accepted by the generated function
 */
type CVAProps<Def extends CVADefinition> = Def extends CVADefinition<infer Variants, any>
  ? {
      [K in keyof Variants]?: keyof Variants[K];
    } & { className?: string }
  : { className?: string };

export function cva<
  Variants extends Record<string, Record<string, string>> = {},
  Defaults extends Partial<{ [K in keyof Variants]: keyof Variants[K] }> = {}
>(
  base: string,
  def?: {
    variants?: Variants;
    defaultVariants?: Defaults;
  }
) {
  return (props: CVAProps<{ variants: Variants; defaultVariants: Defaults }> = {}) => {
    const classes = [base];
    // Handle variants
    if (def?.variants) {
      for (const key in def.variants) {
        // @ts-ignore
        const value = props[key] ?? def.defaultVariants?.[key];
        // @ts-ignore
        if (value && def.variants[key][value as string]) {
          // @ts-ignore
          classes.push(def.variants[key][value]);
        }
      }
    }
    if (props.className) classes.push(props.className);
    return cn(...classes);
  };
}

/**
 * Utility type to extract variant prop types from a cva instance or definition.
 * Usage: VariantProps<typeof yourCva>
 */
export type VariantProps<T> = T extends (
  props?: infer P
) => any
  ? Omit<P, "className">
  : never;