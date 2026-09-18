import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getDbUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SavedPlaysList } from "@/components/profile/SavedPlaysList";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const dbUser = await getDbUser();
  const plays = dbUser
    ? await prisma.play.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    : [];

  return (
    <AppShell activeKey="profile">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-gold">
              Player profile
            </p>
            <h1 className="font-mono text-2xl font-semibold tracking-[-0.035em] text-text-primary sm:text-3xl">
              Your chess space
            </h1>
            <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-text-secondary">
              Your account, saved games, and personal chess activity in one place.
            </p>
          </div>

          <div className="hidden rounded-full border border-border-default bg-bg-surface/70 px-3 py-1.5 text-[11px] text-text-muted shadow-sm sm:block">
            {plays.length} saved {plays.length === 1 ? "game" : "games"}
          </div>
        </div>

        <div className="space-y-6">
          <ProfileHeader user={session.user} playsCount={plays.length} />

          <section
            aria-labelledby="saved-games-heading"
            className="overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-panel"
          >
            <div className="flex flex-col gap-3 border-b border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-gold">
                  Library
                </p>
                <h2
                  id="saved-games-heading"
                  className="mt-1 font-mono text-base font-semibold tracking-tight text-text-primary"
                >
                  Saved games
                </h2>
              </div>

              <span className="w-fit rounded-full border border-border-subtle bg-bg-elevated px-2.5 py-1 font-mono text-[10px] text-text-muted">
                Latest first
              </span>
            </div>

            <div className="p-1 sm:p-2">
              <SavedPlaysList plays={plays} />
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
