import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function NavAuth() {
  const { data: session, status } = useSession();

  if (status === 'authenticated' && session.user) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="shrink-0 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-accent-gold-bright"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="shrink-0 rounded-lg border border-accent-gold/40 bg-accent-gold-dim px-3 py-1.5 text-[13px] font-medium text-accent-gold-bright transition-colors hover:border-accent-gold/70"
    >
      Sign In
    </Link>
  );
}