'use client';

import { useState } from 'react';
import { Button } from '@/components/tablebase/ui/button';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { useChessImageScan } from '@/hooks/tablebase/use-chess-image-scan';
import { useChessFenLoad } from '@/hooks/tablebase/use-chess-fen-load';
import { useChessClipboardPaste } from '@/hooks/tablebase/use-chess-clipboard-paste';
import { ScanDropzone } from './ScanDropzone';
import { ScanFenInput } from './ScanFenInput';

export function ScanModal() {
  const open = useTablebaseStore((s) => s.isUploadOpen);
  const setOpen = useTablebaseStore((s) => s.setUploadOpen);
  const [value, setValue] = useState('');
  const [sideToMove, setSideToMove] = useState<'w' | 'b'>('w');
  const [dragging, setDragging] = useState(false);

  const onSuccess = () => {
    setValue('');
    setOpen(false);
  };

  const {
    busy: imageBusy,
    msg: imageMsg,
    setMsg: setImageMsg,
    fileInputRef,
    recognizeImage,
  } = useChessImageScan(sideToMove, onSuccess);

  const { busy: fenBusy, msg: fenMsg, setMsg: setFenMsg, loadFen } = useChessFenLoad(sideToMove, onSuccess);

  const busy = imageBusy || fenBusy;
  const msg = imageMsg || fenMsg;

  useChessClipboardPaste(open, recognizeImage);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center">
      <div
        role="dialog"
        aria-labelledby="scan-title"
        className="w-full max-w-lg rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 id="scan-title" className="font-display text-lg text-fg">
          Add a position
        </h2>
        <p className="mt-1 text-sm text-muted text-pretty">
          Upload an image screenshot, drop a file, paste from clipboard (Ctrl+V), or enter FEN manually.
        </p>

        <ScanDropzone
          dragging={dragging}
          busy={busy}
          fileInputRef={fileInputRef}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file?.type.startsWith('image/')) void recognizeImage(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          onFileChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void recognizeImage(file);
          }}
        />

        <ScanFenInput value={value} sideToMove={sideToMove} onChangeValue={setValue} onChangeSide={setSideToMove} />

        {msg && <p className="mt-2 text-micro text-danger">{msg}</p>}

        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={busy || !value.trim()}
            onClick={() => void loadFen(value)}>
            {busy ? 'Loading…' : 'Load FEN'}
          </Button>
        </div>
      </div>
    </div>
  );
}
