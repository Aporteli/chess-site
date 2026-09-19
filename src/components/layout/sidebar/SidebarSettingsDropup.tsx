'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Settings, ChevronUp, UserRound, Bell, Palette, Bot, Keyboard } from 'lucide-react';
import type { NavKey } from '@/lib/types';
import { KeyboardCheatsheet } from '@/components/trainer/trainer-hud/KeyboardCheatsheet'; 

interface SettingsItem {
  key: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  comingSoon?: boolean;
  action?: 'keyboard'; // ← ახალი: ლინკის ნაცვლად მოქმედება
}

const settingsItems: SettingsItem[] = [
  { key: 'account',       label: 'Account',            href: '/settings/account',       icon: UserRound },
  { key: 'notifications', label: 'Notifications',      href: '/settings/notifications', icon: Bell },
  { key: 'appearance',    label: 'Appearance',         href: '/settings/appearance',    icon: Palette },
  { key: 'engine',        label: 'Engine',             href: '/settings/engine',        icon: Bot },
  { key: 'keyboard',      label: 'Keyboard Shortcuts', action: 'keyboard',              icon: Keyboard },
];

interface SidebarSettingsDropupProps {
  activeKey: NavKey;
  collapsed: boolean;
  onCloseMobile: () => void;
}

export function SidebarSettingsDropup({
  activeKey,
  collapsed,
  onCloseMobile,
}: SidebarSettingsDropupProps) {
  const [open, setOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // გარეთ დაჭერის ან Escape-ისას დახურვა
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const isActive = activeKey === 'settings';

  const triggerClasses = [
    'flex w-full items-center gap-3 rounded-lg border transition-colors font-mono',
    'px-3 py-2.5 sm:px-3 sm:py-2.5 lg:px-3 lg:py-2',
    'text-[13.5px] font-medium',
    collapsed ? 'justify-center' : '',
    isActive
      ? 'border-[#4A7C59] bg-[#4A7C59]/20 text-white font-semibold'
      : open
        ? 'border-[#383838] bg-[#2A2A2A] text-white'
        : 'border-transparent text-[#A0A0A0] hover:border-[#383838] hover:bg-[#2A2A2A] hover:text-white',
  ].join(' ');

  const handleKeyboardClick = () => {
    setOpen(false);
    onCloseMobile();
    setKeyboardOpen(true);
  };

  return (
    <>
      <div ref={containerRef} className="group relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          title={collapsed ? 'Settings' : undefined}
          aria-haspopup="menu"
          aria-expanded={open}
          className={triggerClasses}
        >
          <Settings
            className={`h-[18px] w-[18px] shrink-0 ${
              isActive || open ? 'text-[#769656]' : 'text-[#A0A0A0]'
            }`}
            strokeWidth={2}
          />
          {!collapsed && <span className="truncate">Settings</span>}
          {!collapsed && (
            <ChevronUp
              className={`ml-auto h-3.5 w-3.5 shrink-0 text-[#A0A0A0] transition-transform ${
                open ? 'rotate-180' : ''
              }`}
              strokeWidth={2}
            />
          )}
        </button>

        {/* ჩაკეცილში tooltip, როცა dropup დახურულია */}
        {collapsed && !open && (
          <span className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-[#383838] bg-[#1E1E1E] px-2 py-1 font-mono text-xs text-white opacity-0 shadow-2xl transition-opacity group-hover:opacity-100">
            Settings
          </span>
        )}

        {/* Dropup მენიუ */}
        {open && (
          <div
            role="menu"
            className={[
              'absolute z-30 min-w-[190px] rounded-lg border border-[#383838] bg-[#1E1E1E] p-1 shadow-2xl',
              collapsed
                ? 'bottom-0 left-full ml-2'
                : 'bottom-full left-0 right-0 mb-2',
            ].join(' ')}
          >
            {settingsItems.map((s) => {
              const disabled = !s.href && !s.action;
              const Icon = s.icon;
              const itemCls = [
                'flex w-full items-center gap-3 rounded-md px-2.5 py-2 font-mono text-[13px] transition-colors text-left',
                disabled
                  ? 'text-[#666] cursor-not-allowed'
                  : 'text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white',
              ].join(' ');

              const inner = (
                <>
                  <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={2} />
                  <span className="truncate">{s.label}</span>
                  {s.comingSoon && (
                    <span className="ml-auto shrink-0 rounded-full border border-[#383838] bg-[#2A2A2A] px-1.5 py-0.5 text-[10px] font-semibold text-[#A0A0A0]">
                      Soon
                    </span>
                  )}
                </>
              );

              // მოქმედების ელემენტი (მაგ. Keyboard Shortcuts)
              if (s.action === 'keyboard') {
                return (
                  <button
                    key={s.key}
                    type="button"
                    role="menuitem"
                    onClick={handleKeyboardClick}
                    className={itemCls}
                  >
                    {inner}
                  </button>
                );
              }

              // გამორთული
              if (disabled) {
                return (
                  <button key={s.key} disabled role="menuitem" className={itemCls}>
                    {inner}
                  </button>
                );
              }

              // ჩვეულებრივი ლინკი
              return (
                <Link
                  key={s.key}
                  href={s.href!}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    onCloseMobile();
                  }}
                  className={itemCls}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Keyboard Cheatsheet მოდალი — sidebar-ის გარეთ, portal-ის მსგავსად ცალკე */}
      <KeyboardCheatsheet open={keyboardOpen} onClose={() => setKeyboardOpen(false)} />
    </>
  );
}