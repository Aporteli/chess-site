import { MoveButton } from "./MoveButton";
import { SiblingRow } from "./SiblingRow";
import type { TurnRow } from "./types";


export function TurnRowView({
  row,
  activeNodeId,
  onJump,
  onDelete,
}: {
  row: TurnRow;
  activeNodeId: string;
  onJump: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="px-1 py-1">
      {/* ძირითადი ხაზის სვლები */}
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center">
        <span className="text-right font-mono text-xs font-semibold text-accent-gold/80">
          {row.turnNumber}.
        </span>

        {row.white ? (
          <MoveButton
            node={row.white}
            parentFen={row.whiteParentFen ?? ""}
            isActive={activeNodeId === row.white.id}
            onJump={onJump}
            onDelete={onDelete}
          />
        ) : (
          <span />
        )}

        {row.black ? (
          <MoveButton
            node={row.black}
            parentFen={row.blackParentFen ?? ""}
            isActive={activeNodeId === row.black.id}
            onJump={onJump}
            onDelete={onDelete}
          />
        ) : (
          <span />
        )}
      </div>

      {/* თეთრების ალტერნატივები */}
      <SiblingRow label="or White" siblings={row.whiteSiblings ?? []} onJump={onJump} onDelete={onDelete} />

      {/* შავების ალტერნატივები */}
      <SiblingRow label="or Black" siblings={row.blackSiblings ?? []} onJump={onJump} onDelete={onDelete} />
    </div>
  );
}