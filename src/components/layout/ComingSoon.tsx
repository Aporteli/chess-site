import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Placeholder view for modules that aren't built yet (Puzzles, Analysis,
 * Courses, ...). Each future feature gets its own route + real page, but
 * mounts this until the feature ships — keeps the sidebar links honest
 * without 404s.
 */
export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-accent-teal/25 bg-accent-teal-dim text-accent-teal-bright">
        <Icon className="h-6 w-6" />
      </span>
      <h1 className="font-serif-display text-xl font-medium text-text-primary">{title}</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">{description}</p>
      <span className="mt-5 rounded-full border border-border-default bg-bg-elevated px-3 py-1 text-[11px] font-medium text-text-muted">
        Coming soon
      </span>
    </div>
  );
}
