import { UserRound, Mail, Trophy, Gamepad2, ShieldCheck } from "lucide-react";
import { SignOutButton } from "@/components/profile/SignOutButton";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  playsCount: number;
}

export function ProfileHeader({ user, playsCount }: ProfileHeaderProps) {
  const displayName = user.name || "Chess Master";
  const initial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <div className="flex flex-col gap-6">
      {/* Main Profile Card */}
      <section className="relative overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-panel">
        <div className="relative h-28 w-full border-b border-border-subtle bg-gradient-to-r from-amber-950/40 via-bg-elevated to-accent-gold/10">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
        </div>

        <div className="relative px-5 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="relative">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={displayName}
                  width={80}
                  height={80}
                  className="h-20 w-20 shrink-0 rounded-2xl border-4 border-bg-surface object-cover shadow-lg ring-1 ring-accent-gold/30"
                />
              ) : (
                <div
                  aria-hidden
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-bg-surface bg-accent-gold-dim font-mono text-2xl font-bold text-accent-gold-bright shadow-lg ring-1 ring-accent-gold/30"
                >
                  {initial}
                </div>
              )}
            </div>

            <SignOutButton />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="truncate font-mono text-xl font-semibold text-text-primary">
                {displayName}
              </h2>
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent-gold" />
            </div>
            <p className="mt-0.5 truncate text-[13px] text-text-secondary">
              {user.email ?? "No email provided"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border-subtle border-t border-border-subtle bg-bg-elevated/30">
          <div className="flex items-center gap-3 px-4 py-3">
            <Gamepad2 className="h-5 w-5 text-accent-gold shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Saved Plays
              </p>
              <p className="font-mono text-base font-medium text-text-primary">
                {playsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3">
            <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Status
              </p>
              <p className="font-mono text-xs font-medium text-text-primary">
                Active Player
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Details Card */}
      <section className="overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-panel">
        <dl className="divide-y divide-border-subtle">
          <div className="flex items-start gap-3.5 px-5 py-4">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border-default bg-bg-elevated text-accent-gold">
              <UserRound className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Display Name
              </dt>
              <dd className="mt-0.5 truncate text-[13.5px] text-text-primary">
                {user.name || "Not provided"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3.5 px-5 py-4">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border-default bg-bg-elevated text-accent-teal-bright">
              <Mail className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Email Address
              </dt>
              <dd className="mt-0.5 break-all text-[13.5px] text-text-primary">
                {user.email || "Not provided"}
              </dd>
            </div>
          </div>
        </dl>
      </section>
    </div>
  );
}