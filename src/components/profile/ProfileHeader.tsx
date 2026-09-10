import { UserRound, Mail } from "lucide-react";
import { SignOutButton } from "@/components/profile/SignOutButton";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const displayName = user.name || "მომხმარებელი";
  const initial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <section className="overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-panel">
      <div className="flex flex-col gap-5 border-b border-border-subtle px-5 py-6 sm:flex-row sm:items-center sm:px-7">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={displayName}
            width={88}
            height={88}
            className="h-[88px] w-[88px] shrink-0 rounded-2xl border border-accent-gold/40 object-cover shadow-panel"
          />
        ) : (
          <div
            aria-hidden
            className="grid h-[88px] w-[88px] shrink-0 place-items-center rounded-2xl border border-accent-gold/40 bg-accent-gold-dim font-serif-display text-3xl text-accent-gold-bright"
          >
            {initial}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-serif-display text-xl text-text-primary">
            {displayName}
          </h2>
          <p className="mt-1 truncate text-[13.5px] text-text-secondary">
            {user.email ?? "ელ-ფოსტა მითითებული არ არის"}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-border-subtle">
        <div className="flex items-start gap-4 px-5 py-4 sm:px-7">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border-default bg-bg-elevated text-accent-gold">
            <UserRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <dt className="font-mono text-[10.5px] uppercase tracking-wider text-text-muted">
              სახელი
            </dt>
            <dd className="mt-0.5 truncate text-[14px] text-text-primary">
              {user.name || "მითითებული არ არის"}
            </dd>
          </div>
        </div>

        <div className="flex items-start gap-4 px-5 py-4 sm:px-7">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border-default bg-bg-elevated text-accent-teal-bright">
            <Mail className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <dt className="font-mono text-[10.5px] uppercase tracking-wider text-text-muted">
              ელ-ფოსტა
            </dt>
            <dd className="mt-0.5 break-all text-[14px] text-text-primary">
              {user.email || "მითითებული არ არის"}
            </dd>
          </div>
        </div>
      </dl>

      <div className="border-t border-border-subtle bg-bg-elevated/40 px-5 py-4 sm:px-7">
        <SignOutButton />
      </div>
    </section>
  );
}