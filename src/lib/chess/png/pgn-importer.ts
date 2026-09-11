import { playSan, START_FEN } from "../fen";
import { EVAL_FROM_NAG } from "../nags";
import { addSanMove } from "../tree/tree-mutations";
import { emptyChapter } from "../tree/chapter-factory";
import { getNode } from "../tree/tree-navigation";
import type { Chapter } from "../types";
import { parsePgn, type ParsedGame, type ParsedMove } from "./pgnAST";

function applySequence(chapter: Chapter, parentId: string, moves: ParsedMove[]): Chapter {
  let current = chapter;
  let parent = parentId;
  for (const move of moves) {
    try {
      playSan(getNode(current, parent).fen, move.san);
    } catch {
      break;
    }
    const evalLabel = move.nags.map((n) => EVAL_FROM_NAG[n]).find(Boolean) ?? null;
    const added = addSanMove(current, parent, move.san, {
      nags: move.nags,
      comment: move.comment,
      eval: evalLabel ?? null,
    });
    current = added.chapter;
    for (const variation of move.variations) {
      current = applySequence(current, parent, variation);
    }
    parent = added.node.id;
  }
  return current;
}

export function chapterFromGame(game: ParsedGame, fallbackName: string): Chapter {
  const startFen = game.headers.FEN || game.headers.Fen || START_FEN;
  const name = game.headers.Opening || game.headers.White || game.headers.Event || fallbackName;
  let chapter = emptyChapter(name, {
    eco: game.headers.ECO ?? "",
    variation: game.headers.Variation ?? game.headers.Black ?? "",
    startFen,
  });
  if (game.moves[0] && !game.moves[0].comment && game.headers.Annotator) {
    chapter = {
      ...chapter,
      nodes: {
        ...chapter.nodes,
        [chapter.rootId]: {
          ...chapter.nodes[chapter.rootId]!,
          comment: `Annotator: ${game.headers.Annotator}`,
        },
      },
    };
  }
  return applySequence(chapter, chapter.rootId, game.moves);
}

export function importPgn(pgn: string, fallbackName = "Imported line"): Chapter[] {
  return parsePgn(pgn).map((game, i) =>
    chapterFromGame(game, game.headers.Opening ? fallbackName : `${fallbackName} ${i + 1}`),
  );
}