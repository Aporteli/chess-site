'use client';

import { CurrentLine } from './CurrentLine';
import { EngineSuggestions } from './EngineSuggestions';

export function MoveList() {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
      <EngineSuggestions />
      <CurrentLine />
    </div>
  );
}
