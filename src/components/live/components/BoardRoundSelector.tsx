import type { ChangeEvent } from 'react';
import type { BroadcastItem } from '../types';
import { useState } from 'react';
import { BookMarked, Check } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

interface BroadcastSelectorsProps {
  broadcasts: BroadcastItem[];
  selectedBroadcastIndex: number;
  selectedRoundId: string | null;
  selectedBroadcast: BroadcastItem | undefined;
  streamConnected: boolean;
  onSelectBroadcast: (index: number) => void;
  onSelectRound: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function BoardRoundSelector({
  broadcasts,
  selectedBroadcastIndex,
  selectedRoundId,
  selectedBroadcast,
  onSelectRound,
}: BroadcastSelectorsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-0 max-w-full">
      <button
        type="button"
        onClick={() => {
          if (isOpen) closeDropdown();
          else setIsOpen(true);
        }}
        className={`flex h-8 min-w-0 max-w-full items-center gap-2 rounded-md px-2.5 font-mono text-xs transition-all duration-150 ${
          isOpen ? 'bg-[#383838] text-white' : 'bg-[#2A2A2A] text-white hover:bg-[#383838]'
        }`}>
        <BookMarked className="size-3.5 shrink-0 text-[#769656]" />

        <span className="min-w-0 max-w-[4.5rem] truncate font-semibold text-white sm:max-w-[8rem] lg:max-w-[12rem] xl:max-w-[240px]">
          {selectedRoundId ?? 'Select round'}
        </span>

        <ChevronDown
          className={`size-3 shrink-0 text-[#A0A0A0] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-[min(18rem,calc(100vw-1.5rem))] pt-1 animate-in fade-in-0 slide-in-from-top-1 duration-100">
          <div className="flex flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#1E1E1E] shadow-2xl">
            {/* ── Header ── */}
            <div className="flex flex-col gap-1.5 border-b border-[#383838] bg-[#2A2A2A] p-2"></div>

            {/* ── List ── */}
            <div className="thin-scrollbar max-h-64 overflow-y-auto p-1">
              {selectedBroadcast?.rounds.map((round) => {
                const active = round.id === selectedRoundId;

                return (
                  <div
                    key={round.id}
                    className={`group flex h-8 select-none items-center justify-between gap-2 rounded px-2 font-mono text-xs transition-colors ${
                      active ? 'bg-[#4A7C59] text-white font-semibold' : 'text-white hover:bg-[#2A2A2A]'
                    }`}
                    onClick={() => onSelectRound({ target: { value: round.id } } as ChangeEvent<HTMLSelectElement>)}
                    onContextMenu={(e) => e.preventDefault()}>
                    {/* 👇 აქ უნდა იყოს კონტენტი */}
                    <span className="truncate">{round.name}</span>

                    {active && <Check className="size-3 shrink-0 text-white" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
