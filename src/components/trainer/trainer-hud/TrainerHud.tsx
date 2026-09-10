'use client';

import { memo, useState } from 'react';
import { useTrainer } from '@/lib/trainer/context';
import { SrsProgress } from './SrsProgress';
import { MoveList } from '../move-list/MoveList';
import { HintBox } from './HintBox';
import { ActionToolbar } from '../action-toolbar/ActionToolbar';
import { RepertoireBar } from './RepertoireBar';
import { DrillFilters } from './DrillFilters';
import { MoveTree } from './MoveTree';
import { AnnotationEditor } from '../anotation-editor/AnnotationEditor';
import { MasterReference } from '../Master-reference/MasterReference';
import { TranspositionAlert } from './TranspositionAlert';
import { PgnDialog } from '../PgnDialog';
import { KeyboardCheatsheet } from './KeyboardCheatsheet';
import { BoardSettings } from '../settings/BoardSettings';
import { OpeningHeaderCard } from './OpeningHeaderCard';
import { HudActionButtons } from './HudActionButtons';

export const TrainerHud = memo(function TrainerHud() {
  const { mode } = useTrainer();
  const [pgn, setPgn] = useState<'import' | 'export' | null>(null);
  const [keys, setKeys] = useState(false);

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <OpeningHeaderCard />
      <TranspositionAlert />
      <HintBox />
      {mode === 'drill' && <DrillFilters />}
      <SrsProgress />
      <MoveList />
      <MoveTree />
      {mode === 'study' && <AnnotationEditor />}
      <MasterReference />
      <RepertoireBar />
      {mode === 'study' && <BoardSettings />}

      <HudActionButtons
        onImport={() => setPgn('import')}
        onExport={() => setPgn('export')}
        onOpenKeyboard={() => setKeys(true)}
      />

      <div className="pt-1">
        <ActionToolbar />
      </div>

      <PgnDialog open={pgn !== null} mode={pgn ?? 'import'} onClose={() => setPgn(null)} />
      <KeyboardCheatsheet open={keys} onClose={() => setKeys(false)} />
    </div>
  );
});
