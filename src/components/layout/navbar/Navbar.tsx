'use client';

import { useState } from 'react';
import { Menu, SlidersHorizontal } from 'lucide-react';
import { NavSearch } from './NavSearch';
import { BoardSettingsDropdown } from './BoardSettingsDropdown';
import { NavAuth } from './NavAuth';
import { EndgameGridList } from '@/components/tablebase/chess/endgame-catalog/EndgameGridList';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { loadEndgame } from '@/lib/tablebase/chess/card-nav';
import { deleteAllKinds, deleteKind } from '@/lib/tablebase/chess/catalog-actions';
import { VariationsDropdown } from '@/components/tablebase/chess/variations-panel/VariationsDropdown';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onOpenMobileNav: () => void;
}

export function Navbar({ onOpenMobileNav }: NavbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const pathname = usePathname();
  const catalog = useTablebaseStore((s) => s.catalog);
  const query = useTablebaseStore((s) => s.endgameQuery);
  const index = useTablebaseStore((s) => s.endgameIndex);
  const building = useTablebaseStore((s) => s.pipeline !== 'idle');
  const setUploadOpen = useTablebaseStore((s) => s.setUploadOpen);

  const q = query.trim().toLowerCase();
  const filtered = catalog.flatMap((eg, i) =>
    !q || eg.id.toLowerCase().includes(q) || eg.icons.includes(q) ? [{ eg, i }] : [],
  );

  return (
    <header className="sticky top-0 z-30 shrink-0 bg-[#1E1E1E] border-b border-[#383838] backdrop-blur-md pr-17">
      <div className="flex h-14 items-center justify-between px-3 sm:h-16 sm:px-5">
        
        {/* 1. მარცხენა სექცია: მობილურის მენიუ + დესკტოპის დროპდაუნები */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
            className="rounded-md p-1.5 text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white transition-colors lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          {/* დესკტოპზე ხილული დროპდაუნები (sm-დან ზემოთ) */}
          {pathname === '/tablebase' && (
            <div className="hidden items-center gap-2 sm:flex">
              <EndgameGridList
                filtered={filtered}
                currentIndex={index}
                building={building}
                onLoad={loadEndgame}
                onDelete={deleteKind}
                onAdd={() => setUploadOpen(true)}
                onDeleteAll={deleteAllKinds}
              />
              <VariationsDropdown />
            </div>
          )}

          {/* მობილურის ინსტრუმენტების ჩამოსაშლელი ღილაკი (მხოლოდ < sm-ზე) */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setMobileToolsOpen((v) => !v)}
              className="flex h-8 items-center gap-1.5 rounded-md bg-[#2A2A2A] px-2.5 text-xs font-mono font-medium text-white hover:bg-[#383838] transition-colors"
            >
              <SlidersHorizontal className="size-3.5 text-[#769656]" />
              <span>Tools</span>
            </button>

            {pathname === '/tablebase' && mobileToolsOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 flex w-64 flex-col gap-2 rounded-lg bg-[#1E1E1E] p-2 border border-[#383838] shadow-2xl">
                <div onClick={() => setMobileToolsOpen(false)}>
                  <EndgameGridList
                    filtered={filtered}
                    currentIndex={index}
                    building={building}
                    onLoad={loadEndgame}
                    onDelete={deleteKind}
                    onAdd={() => setUploadOpen(true)}
                    onDeleteAll={deleteAllKinds}
                  />
                </div>
                <div onClick={() => setMobileToolsOpen(false)}>
                  <VariationsDropdown />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. მარჯვენა სექცია: ძებნა, პარამეტრები, პროფილი */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <NavSearch
            isOpen={searchOpen}
            onToggle={() => {
              setSearchOpen((v) => !v);
              setSettingsOpen(false);
            }}
            onClose={() => setSearchOpen(false)}
          />

          <BoardSettingsDropdown
            isOpen={settingsOpen}
            onToggle={() => {
              setSettingsOpen((v) => !v);
              setSearchOpen(false);
            }}
          />

          <NavAuth />
        </div>

      </div>
    </header>
  );
}