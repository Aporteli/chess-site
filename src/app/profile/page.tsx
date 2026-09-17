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
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 border-b border-border-subtle pb-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-gold">
            Overview
          </p>
          <h1 className="mt-1 font-mono text-2xl font-semibold text-text-primary sm:text-3xl">
            User Profile
          </h1>
          <p className="mt-1.5 text-[13.5px] text-text-secondary">
            Your account details, saved games, and session management
          </p>
        </header>

        {/* Grid Layout: მარცხნივ პროფილი/ინფო (1 სვეტი), მარჯვნივ თამაშები (2 სვეტი) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProfileHeader user={session.user} playsCount={plays.length} />
          </div>
          <div className="lg:col-span-2">
            <SavedPlaysList plays={plays} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}