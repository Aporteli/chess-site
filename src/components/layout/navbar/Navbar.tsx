'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTrainerOptional } from '@/lib/trainer/context';
import { NavBreadcrumbs } from './NavBreadcrumbs';
import { NavSearch } from './NavSearch';
import { BoardSettingsDropdown } from './BoardSettingsDropdown';
import { NavAuth } from './NavAuth';

interface NavbarProps {
  onOpenMobileNav: () => void;
}

export function Navbar({ onOpenMobileNav }: NavbarProps) {
  const trainer = useTrainerOptional();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border-subtle bg-bg-surface/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-3 sm:h-16 sm:px-5">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <NavBreadcrumbs />

        <NavSearch
          isOpen={searchOpen}
          onToggle={() => {
            setSearchOpen((v) => !v);
            setSettingsOpen(false);
          }}
          onClose={() => setSearchOpen(false)}
        />

        {trainer && (
          <span className="hidden rounded-full border border-border-default px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-text-muted lg:inline">
            {trainer.mode === 'study' ? 'Study' : 'Drill'}
          </span>
        )}

        <BoardSettingsDropdown
          isOpen={settingsOpen}
          onToggle={() => {
            setSettingsOpen((v) => !v);
            setSearchOpen(false);
          }}
        />

        <NavAuth />
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />
    </header>
  );
}
