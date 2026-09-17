"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import { migrateLegacySettings } from "@/stores/settings-store";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    migrateLegacySettings();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}