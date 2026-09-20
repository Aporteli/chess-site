'use client';

import type { ReactNode } from 'react';
import { useHydrateOnMount } from './hooks/useHydrateOnMount';

export function TrainerProvider({
  children,
  full = false,
}: {
  children: ReactNode;
  /** Load every repertoire's chapter trees up front (needed for library-wide stats). */
  full?: boolean;
}) {
  useHydrateOnMount(full);
  return <>{children}</>;
}
