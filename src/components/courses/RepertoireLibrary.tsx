'use client';

import { useState } from 'react';
import { useTrainer } from '@/lib/trainer/context';
import { PgnDialog } from '../trainer/PgnDialog';
import { CreateRepertoireForm } from './CreateRepertoireForm';
import { RepertoireHeader } from './RepertoireHeader';
import { RepertoireList } from './RepertoireList';

export function RepertoireLibrary() {
  const t = useTrainer();
  const [pgn, setPgn] = useState(false);

  return (
    <div className="mx-auto max-w-[1100px] p-4 sm:p-6">
      <RepertoireHeader onImportClick={() => setPgn(true)} onResetClick={t.resetToSeed} />

      <CreateRepertoireForm onCreate={t.createRepertoire} />

      <RepertoireList repertoires={t.store.repertoires} onDelete={t.deleteRepertoire} onSelect={t.selectRepertoire} />

      <PgnDialog open={pgn} mode="import" onClose={() => setPgn(false)} />
    </div>
  );
}
