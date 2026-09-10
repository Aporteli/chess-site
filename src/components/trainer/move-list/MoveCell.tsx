'use client';

interface MoveCellProps {
  san?: string;
  ply?: number;
  activePly: number;
  onJump: (ply: number) => void;
}

export function MoveCell({ san, ply, activePly, onJump }: MoveCellProps) {
  if (!san || ply === undefined || ply < 0) {
    return <span className="min-w-0 flex-1" />;
  }

  const isActive = ply === activePly;

  return (
    <button
      type="button"
      onClick={() => onJump(ply)}
      className={[
        'min-w-0 flex-1 truncate rounded-md px-2 py-1 text-left font-mono text-[13px] transition-colors',
        isActive
          ? 'bg-accent-teal-dim text-accent-teal-bright ring-1 ring-inset ring-accent-teal/30'
          : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
      ].join(' ')}>
      {san}
    </button>
  );
}
