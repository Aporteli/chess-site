"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import type { Session } from "next-auth";
import { migrateLegacySettings } from "@/stores/settings-store";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  useEffect(() => {
    migrateLegacySettings();
  }, []);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}