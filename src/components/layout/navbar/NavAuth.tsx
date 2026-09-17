'use client';

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
          className="shrink-0 rounded-lg border border-[#383838] bg-[#2A2A2A] px-3 py-1.5 font-mono text-[13px] font-medium text-[#A0A0A0] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="shrink-0 rounded-lg bg-[#769656] px-3 py-1.5 font-mono text-[13px] font-medium text-white transition-colors hover:bg-[#81B64C]"
    >
      Sign In
    </Link>
  );
}