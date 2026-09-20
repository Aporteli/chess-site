'use client';

import { useState } from 'react';
import { useTrainerStore } from '@/lib/trainer/store';
import { PgnDialog } from '../trainer/PgnDialog';
import { CreateRepertoireForm } from './CreateRepertoireForm';
import { RepertoireHeader } from './RepertoireHeader';
import { RepertoireList } from './RepertoireList';

export function RepertoireLibrary() {
  const repertoires = useTrainerStore((s) => s.store.repertoires);
  const createRepertoire = useTrainerStore((s) => s.createRepertoire);
  const deleteRepertoire = useTrainerStore((s) => s.deleteRepertoire);
  const selectRepertoire = useTrainerStore((s) => s.selectRepertoire);
  const resetToSeed = useTrainerStore((s) => s.resetToSeed);
  const [pgn, setPgn] = useState(false);

  return (
    <div className="mx-auto max-w-[1100px] p-4 sm:p-6">
      <RepertoireHeader onImportClick={() => setPgn(true)} onResetClick={resetToSeed} />

      <CreateRepertoireForm onCreate={createRepertoire} />

      {repertoires.length === 0 ? (
        <p className="rounded-xl border border-border-subtle bg-bg-surface px-4 py-8 text-center text-[13px] text-text-muted">
          No repertoires yet. Create one above or import a PGN.
        </p>
      ) : (
        <RepertoireList repertoires={repertoires} onDelete={deleteRepertoire} onSelect={selectRepertoire} />
      )}

      <PgnDialog open={pgn} mode="import" onClose={() => setPgn(false)} />
    </div>
  );
}
