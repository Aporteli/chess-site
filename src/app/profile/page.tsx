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

        <ProfileHeader user={session.user} />
        <SavedPlaysList plays={plays} />
      </div>
    </AppShell>
  );
}