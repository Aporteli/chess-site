"use client";

interface AnnotationHeaderProps {
  moveSan?: string;
}

export function AnnotationHeader({ moveSan }: AnnotationHeaderProps) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between">
      <h3 className="font-serif-display text-[15px] text-text-primary">Annotations</h3>
      {moveSan && <span className="font-mono text-[11px] text-accent-gold-bright">{moveSan}</span>}
    </div>
  );
}