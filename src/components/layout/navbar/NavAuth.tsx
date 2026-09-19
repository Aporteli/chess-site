'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function NavAuth() {
  const { status } = useSession();

  // ავტორიზებული ან ჯერ იტვირთება → არაფერი არ ვაჩვენოთ
  if (status !== 'unauthenticated') return null;

  return (
    <Link
      href="/auth/signin"
      className="shrink-0 rounded-lg border border-accent-gold/35 bg-accent-gold-dim px-3 py-1.5 font-mono text-[13px] font-semibold text-accent-gold-bright transition-colors duration-200 ease-in-out hover:border-accent-gold/70 hover:bg-accent-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50"
    >
      Sign In
    </Link>
  );
}