import { RepertoireCard } from "./RepertoireCard";

interface RepertoireListProps {
  repertoires: any[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function RepertoireList({ repertoires, onDelete, onSelect }: RepertoireListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {repertoires.map((rep) => (
        <RepertoireCard
          key={rep.id}
          rep={rep}
          isOnlyOne={repertoires.length <= 1}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}