import { Upload } from 'lucide-react';

interface RepertoireHeaderProps {
  onImportClick: () => void;
  onResetClick: () => void;
}

export function RepertoireHeader({ onImportClick, onResetClick }: RepertoireHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-accent-gold/70">Library</p>
        <h1 className="font-serif-display text-[28px] font-medium text-text-primary">Courses & repertoire</h1>
        <p className="mt-1 max-w-xl text-[13.5px] text-text-secondary">
          Distinct White and Black files, each with branching chapters. Open a file to author the tree or drill it with
          spaced repetition.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onImportClick}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-3 py-2 text-[13px] text-text-secondary hover:text-accent-gold-bright">
          <Upload className="h-3.5 w-3.5" />
          Import PGN
        </button>
        <button
          onClick={onResetClick}
          className="rounded-lg border border-border-default px-3 py-2 text-[13px] text-text-muted hover:text-text-secondary">
          Restore demo files
        </button>
      </div>
    </div>
  );
}
