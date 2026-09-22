import type { ChangeEvent } from 'react';
import type { BroadcastItem } from '../types';

interface BroadcastSelectorsProps {
  broadcasts: BroadcastItem[];
  selectedBroadcastIndex: number;
  selectedRoundId: string | null;
  selectedBroadcast: BroadcastItem | undefined;
  streamConnected: boolean;
  onSelectBroadcast: (index: number) => void;
  onSelectRound: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function BroadcastSelectors({
  broadcasts,
  selectedBroadcastIndex,
  selectedRoundId,
  selectedBroadcast,
  streamConnected,
  onSelectBroadcast,
  onSelectRound,
}: BroadcastSelectorsProps) {
  return (
    <div className="mb-2 grid gap-2 rounded-lg border border-[#383838] bg-[#2A2A2A] p-2 shadow-lg md:grid-cols-2">
      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${streamConnected ? 'bg-[#769656] animate-pulse' : 'bg-[#E63946]'}`} />

        <h1 className="text-xs font-semibold uppercase tracking-wider text-white">Live Broadcast</h1>

        <label
          htmlFor="broadcast"
          className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]">
          Tour
        </label>

        <select
          id="broadcast"
          value={selectedBroadcastIndex}
          onChange={(event) => onSelectBroadcast(Number(event.target.value))}
          className="h-7 w-full rounded-md border border-[#383838] bg-[#1E1E1E] px-2 text-xs text-white outline-none transition-colors focus:border-[#769656]">
          {broadcasts.map((broadcast, index) => (
            <option key={broadcast.tour.id} value={index}>
              {broadcast.tour.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="round" className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]">
          Round
        </label>

        <select
          id="round"
          value={selectedRoundId ?? ''}
          onChange={onSelectRound}
          className="h-7 w-full rounded-md border border-[#383838] bg-[#1E1E1E] px-2 text-xs text-white outline-none transition-colors focus:border-[#769656] disabled:opacity-40"
          disabled={!selectedBroadcast || selectedBroadcast.rounds.length === 0}>
          {selectedBroadcast?.rounds.map((round) => (
            <option key={round.id} value={round.id}>
              {round.name}
              {round.finished ? ' · Finished' : ' · Live'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
