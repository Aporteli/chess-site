import {
  Gamepad2,
  Mail,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
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
  const initial = user.name?.trim()?.[0]?.toUpperCase() || "U";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-panel">
      {/* Subtle chess-inspired atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_5%,rgba(212,175,55,0.11),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-accent-gold/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border border-accent-gold/10"
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={displayName}
                  width={88}
                  height={88}
                  className="h-[76px] w-[76px] rounded-2xl border-2 border-bg-surface object-cover shadow-lg ring-1 ring-accent-gold/25 sm:h-[88px] sm:w-[88px]"
                />
              ) : (
                <div
                  aria-hidden
                  className="grid h-[76px] w-[76px] place-items-center rounded-2xl border-2 border-bg-surface bg-accent-gold-dim font-mono text-2xl font-bold text-accent-gold-bright shadow-lg ring-1 ring-accent-gold/25 sm:h-[88px] sm:w-[88px]"
                >
                  {initial}
                </div>
              )}

              <span
                aria-label="Active player"
                className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-bg-surface bg-bg-elevated shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-accent-teal-bright shadow-[0_0_0_3px_rgba(45,212,191,0.12)]" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate font-mono text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                  {displayName}
                </h2>
                <ShieldCheck
                  aria-label="Verified account"
                  className="h-4 w-4 shrink-0 text-accent-gold"
                />
              </div>

              <p className="mt-1 truncate text-[13px] text-text-secondary">
                {user.email ?? "No email provided"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-elevated px-2.5 py-1 font-mono text-[10px] font-medium text-text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-teal-bright" />
                  Active player
                </span>
                <span className="rounded-full border border-accent-gold/15 bg-accent-gold-dim px-2.5 py-1 font-mono text-[10px] font-medium text-accent-gold-bright">
                  Chess account
                </span>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-center">
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="grid border-t border-border-subtle bg-bg-elevated/25 sm:grid-cols-3">
        <Stat
          icon={<Gamepad2 className="h-4 w-4" />}
          label="Saved plays"
          value={playsCount.toString()}
        />
        <Stat
          icon={<Trophy className="h-4 w-4" />}
          label="Player status"
          value="Active"
        />
        <Stat
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Account"
          value="Verified"
          last    

          
        />
      </div>

    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-5 py-4",
        !last ? "border-b border-border-subtle sm:border-b-0 sm:border-r" : "",
      ].join(" ")}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border-default bg-bg-surface text-accent-gold shadow-sm">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          {label}
        </p>
        <p className="mt-0.5 font-mono text-sm font-semibold text-text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}

