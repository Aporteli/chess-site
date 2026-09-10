import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

interface ImageDropzoneProps {
  loading: boolean;
  onFileSelect: (file: File) => void;
}

export function ImageDropzone({ loading, onFileSelect }: ImageDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    onFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={[
        "mt-4 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        dragging
          ? "border-accent-gold/60 bg-accent-gold-dim"
          : "border-border-subtle hover:border-text-muted",
      ].join(" ")}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent-gold-bright" />
          <span className="text-[13px] text-text-muted">Reading pieces…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Camera className="h-10 w-10 text-text-muted" />
          <span className="text-[13px] font-medium text-text-primary">
            Choose image (PNG, JPG, WEBP)
          </span>
          <span className="text-[12px] text-text-muted">or drop / paste a screenshot</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </label>
  );
}