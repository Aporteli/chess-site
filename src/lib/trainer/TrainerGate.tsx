'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useTrainerStore } from './store';
import { useTrainerValue } from './useTrainer';

export function TrainerGate({
  children,
  allowEmpty = false,
}: {
  children: ReactNode;
  allowEmpty?: boolean;
}) {
  const ready = useTrainerStore((s) => s.ready);
  const value = useTrainerValue();

  if (!ready) {
    return (
      <div className="flex min-h-[50vh]  items-center justify-center px-6">
        <p className="font-mono text-[15px] italic text-text-muted">Opening the study…</p>
      </div>
    );
  }

  if (!value && !allowEmpty) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
        <p className="font-mono text-[15px] text-text-muted">No repertoire yet.</p>
        <Link href="/courses" className="text-[13px] text-accent-gold-bright hover:underline">
          Create one in Courses
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
