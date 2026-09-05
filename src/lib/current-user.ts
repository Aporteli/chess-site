import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getDbUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return prisma.user.upsert({
    where: { email: session.user.email },
    update: { name: session.user.name ?? undefined },
    create: {
      email: session.user.email,
      name: session.user.name ?? null,
      password: "",
    },
  });
}
