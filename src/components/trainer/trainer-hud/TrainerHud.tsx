'use client';

import { memo } from 'react';
import { useTrainer } from '@/lib/trainer/context';
import { SrsProgress } from './SrsProgress';
import { HintBox } from './HintBox';
import { RepertoireBar } from './RepertoireBar';
import { DrillFilters } from './DrillFilters';
import { MoveTree } from './MoveTree';
import { AnnotationEditor } from '../anotation-editor/AnnotationEditor';
import { MasterReference } from '../Master-reference/MasterReference';
import { BoardSettings } from '../settings/BoardSettings';
import { OpeningHeaderCard } from './OpeningHeaderCard';

export const TrainerHud = memo(function TrainerHud() {
  const { mode } = useTrainer();

  return (
    <div className="flex flex-col gap-3 overflow-visible landscape:h-full landscape:min-h-0 landscape:overflow-y-auto thin-scrollbar">
      <OpeningHeaderCard />
      <HintBox />
      {mode === 'drill' && <DrillFilters />}
      <SrsProgress />
      <MoveTree />
      {mode === 'study' && <AnnotationEditor />}
      <MasterReference />
      <RepertoireBar />
      {mode === 'study' && <BoardSettings />}
    </div>
  );
});
