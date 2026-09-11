import { Camera, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';
import { saveAnalysisPlay } from '@/lib/analysis/save-analysis-play';

export function AnalysisActions() {
  const { status } = useSession();
  const game = useAnalysisStore((state) => state.game);
  const history = useAnalysisStore((state) => state.history);
  const fen = useAnalysisStore((state) => state.fen);
  const startFen = useAnalysisStore((state) => state.startFen);
  const saveState = useAnalysisStore((state) => state.saveState);
  const saveMessage = useAnalysisStore((state) => state.saveMessage);
  const openUploadModal = useAnalysisStore((state) => state.openUploadModal);
  const setSaveState = useAnalysisStore((state) => state.setSaveState);

  const handleSave = async () => {
    setSaveState('saving');

    const result = await saveAnalysisPlay(game, history, startFen, fen, status === 'authenticated');

    setSaveState(result.state, result.message);
  };

  return (
    <>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={openUploadModal}
          className="flex-1 rounded-lg border border-[var(--color-border-subtle,#221d17)] bg-[var(--color-bg-elevated,#1c1815)] px-3.5 py-1.5 text-xs text-[var(--color-text-secondary,#b9ac91)] shadow-sm transition-all hover:bg-[var(--color-bg-elevated-hover,#262019)] hover:text-[var(--color-accent-gold-bright,#e8c579)]">
          <span className="flex w-full items-center justify-center gap-1 font-semibold">
            Scan Book <Camera className="ml-0.5 h-3.5 w-3.5" />
          </span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === 'saving'}
          className="flex-1 rounded-lg border border-accent-gold/35 bg-[var(--color-bg-elevated,#1c1815)] px-3.5 py-1.5 text-xs text-accent-gold-bright shadow-sm transition-all hover:border-accent-gold/70 hover:bg-accent-gold-dim disabled:opacity-50">
          <span className="flex w-full items-center justify-center gap-1 font-semibold">
            {saveState === 'saving' ? 'Saving…' : 'Save play'}
            <Save className="ml-0.5 h-3.5 w-3.5" />
          </span>
        </button>
      </div>

      {saveMessage && (
        <p className={`text-[11px] ${saveState === 'error' ? 'text-accent-garnet-bright' : 'text-text-muted'}`}>
          {saveMessage}
        </p>
      )}
    </>
  );
}
