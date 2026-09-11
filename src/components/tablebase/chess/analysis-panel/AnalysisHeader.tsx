'use client';

import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Camera, Cpu, FlipVertical2, Lightbulb, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { handleHint, handleReset } from '@/lib/tablebase/chess/play';
import { fenTurn } from '@/lib/tablebase/chess/moves';
import { useClickOutside } from '@/hooks/navbar/use-click-outside';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { IconButton } from '../IconButton';

interface AnalysisHeaderProps {
  enabled: boolean;
  onToggleEngine: () => void;
}

export function AnalysisHeader() {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-fg/10 pb-2">
    <div className="flex items-center gap-2">
      <span className="size-2 rounded-full bg-accent animate-pulse" />
      <h2 className="font-display text-sm font-semibold tracking-wide text-fg uppercase">
        Analysis
      </h2>
    </div>
  </div>
  );
}
