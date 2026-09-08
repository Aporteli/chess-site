'use client';

import type { ReactNode } from 'react';
import { useHydrateOnMount } from './hooks/useHydrateOnMount';

export function TrainerProvider({ children }: { children: ReactNode }) {
  useHydrateOnMount();
  return <>{children}</>;
}
