import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import { Mail, UserRound } from "lucide-react";
import { getDbUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const { user } = session;
  const dbUser = await getDbUser();
  const plays = dbUser
    ? await prisma.play.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    : [];
  const displayName = user.name || "მომხმარებელი";
  const initial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <AppShell activeKey="profile">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            ანგარიში
          </p>
          <h1 className="mt-1 font-serif-display text-2xl font-medium text-text-primary sm:text-[28px]">
            მომხმარებლის პროფილი
          </h1>
          <p className="mt-1.5 text-[13.5px] text-text-secondary">
            შენი ანგარიშის დეტალები და სესიის მართვა
          </p>
        </header>

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
            <form
              action={async () => {
                "use server";
                const { signOut } = await import("@/auth");
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full rounded-lg border border-accent-garnet/40 bg-accent-garnet-dim px-4 py-2.5 text-[13px] font-medium text-accent-garnet-bright transition-colors hover:border-accent-garnet/70 hover:bg-accent-garnet/15 sm:w-auto"
              >
                სისტემიდან გამოსვლა
              </button>
            </form>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-panel">
          <div className="border-b border-border-subtle px-5 py-4 sm:px-7">
            <h2 className="font-serif-display text-lg text-text-primary">
              Saved plays
            </h2>
            <p className="mt-1 text-[13px] text-text-secondary">
              Games you save from Analysis appear here.
            </p>
          </div>
          {plays.length === 0 ? (
            <p className="px-5 py-6 text-[13.5px] text-text-muted sm:px-7">
              No plays yet. Open Analysis, make some moves, then click Save play.
            </p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {plays.map((play) => (
                <li key={play.id} className="px-5 py-4 sm:px-7">
                  <Link
                    href={`/analysis?play=${play.id}`}
                    className="text-[14px] text-accent-gold-bright hover:underline"
                  >
                    {play.title || "Untitled play"}
                  </Link>
                  <p className="mt-1 font-mono text-[11px] text-text-muted">
                    {play.result} · {play.source} ·{" "}
                    {play.createdAt.toLocaleString()}
                  </p>
                  {play.pgn ? (
                    <p className="mt-1.5 truncate font-mono text-[11px] text-text-secondary">
                      {play.pgn}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
