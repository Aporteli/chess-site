'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Menu, Search, SlidersHorizontal } from 'lucide-react';
import { openingMeta as fallbackMeta } from '@/lib/mock-data';
import { useTrainerOptional } from '@/lib/trainer/context';

const SEARCH_LINKS = [
  { href: '/trainer', label: 'Openings / Trainer' },
  { href: '/puzzles', label: 'Puzzles' },
  { href: '/analysis', label: 'Analysis Board' },
  { href: '/tablebase', label: 'Tablebase' },
  { href: '/courses', label: 'Courses & Repertoire' },
  { href: '/profile', label: 'Profile' },
] as const;

const PAGE_TITLES: Record<string, string> = {
  '/trainer': 'Trainer',
  '/puzzles': 'Puzzles',
  '/analysis': 'Analysis',
  '/tablebase': 'Tablebase',
  '/courses': 'Courses',
  '/profile': 'Profile',
};

interface NavbarProps {
  onOpenMobileNav: () => void;
}

export function Navbar({ onOpenMobileNav }: NavbarProps) {
  const trainer = useTrainerOptional();
  const pathname = usePathname();
  const meta = trainer?.openingMeta ?? fallbackMeta;
  const pageTitle =
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES).find(([href]) => pathname.startsWith(href))?.[1] ??
    'MoveTrainer';
  const crumbs = trainer
    ? [
        meta.repertoireLabel.split(' / ')[0],
        meta.side === 'white' ? 'White' : 'Black',
        meta.variation ? `${meta.name}: ${meta.variation}` : meta.name,
      ]
    : [pageTitle];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_LINKS;
    return SEARCH_LINKS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();

    const onPointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [searchOpen]);

  const goTo = (href: string) => {
    setSearchOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border-subtle bg-bg-surface/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-3 sm:h-16 sm:px-5">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 items-center gap-1.5 text-[13px] md:flex">
          {crumbs.map((crumb, i) => (
            <span key={`${crumb}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && (
                <span className="shrink-0 text-text-muted" aria-hidden>
                  /
                </span>
              )}
              <span className={i === crumbs.length - 1 ? 'truncate text-text-primary' : 'truncate text-text-muted'}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        <div ref={searchRef} className="relative min-w-0 md:w-[240px] md:shrink-0">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open);
              setSettingsOpen(false);
            }}
            className="flex w-full max-w-[240px] items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-2.5 py-1.5 text-left text-[13px] font-medium text-text-muted transition-colors hover:border-accent-gold/40 hover:text-text-secondary sm:px-3">
            <Search className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
            <span className="hidden truncate sm:inline">Search</span>
          </button>

          {searchOpen && (
            <div className="absolute left-0 top-full z-40 mt-2 w-[min(calc(100vw-2rem),20rem)] rounded-xl border border-border-default bg-bg-surface p-2 shadow-panel md:left-auto md:right-0">
              <div className="flex items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && results[0]) goTo(results[0].href);
                  }}
                  placeholder="Go to a page…"
                  className="w-full bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
              <ul className="mt-1.5 max-h-56 overflow-y-auto">
                {results.length === 0 ? (
                  <li className="px-2.5 py-2 text-[12.5px] text-text-muted">No matches</li>
                ) : (
                  results.map((item) => (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => goTo(item.href)}
                        className="flex w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary">
                        {item.label}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {trainer && (
          <span className="hidden rounded-full border border-border-default px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-text-muted lg:inline">
            {trainer.mode === 'study' ? 'Study' : 'Drill'}
          </span>
        )}

        {trainer && (
          <div className="relative">
            <button
              aria-label="Board settings"
              onClick={() => {
                setSettingsOpen((v) => !v);
                setSearchOpen(false);
              }}
              className="hidden shrink-0 items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-teal/40 hover:text-text-primary sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Board
            </button>
            {settingsOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-border-default bg-bg-surface p-3 shadow-panel">
                {(
                  [
                    ['sound', 'Sounds'],
                    ['legalHints', 'Legal hints'],
                    ['animations', 'Animations'],
                    ['coordinates', 'Coordinates'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between py-1 text-[12.5px] text-text-secondary">
                    {label}
                    <input
                      type="checkbox"
                      className="accent-[#c9a256]"
                      checked={trainer.settings[key]}
                      onChange={(e) => trainer.setSettings({ [key]: e.target.checked })}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {status === 'authenticated' && session.user ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="shrink-0 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-accent-gold-bright">
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="shrink-0 rounded-lg border border-accent-gold/40 bg-accent-gold-dim px-3 py-1.5 text-[13px] font-medium text-accent-gold-bright transition-colors hover:border-accent-gold/70">
            Sign In
          </Link>
        )}
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />
    </header>
  );
}
