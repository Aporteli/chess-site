'use client';

import type { ReactNode } from 'react';
import { useTrainerValue } from './useTrainer';

export function TrainerGate({ children }: { children: ReactNode }) {
  const value = useTrainerValue();

  if (!value) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <p className="font-serif-display text-[15px] italic text-text-muted">Opening the study…</p>
      </div>
    );
  }
  return <>{children}</>;
}
