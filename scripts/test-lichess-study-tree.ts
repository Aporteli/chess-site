import fs from "node:fs";
import path from "node:path";

import { parsePgn } from "../src/lib/chess/png/pgnAST";
import { chapterFromGame } from "../src/lib/chess/png/pgn-importer";
import type { Chapter } from "../src/lib/chess/types";

const filePath = path.join(process.cwd(), "data", "lichess-studies.pgn");

const pgn = fs.readFileSync(filePath, "utf8");
const games = parsePgn(pgn);

let playableChapters = 0;
let emptyChapters = 0;
let truncatedChapters = 0;
let totalImportedNodes = 0;
let totalComments = 0;
let totalBranches = 0;

function countMainlineNodes(chapter: Chapter): number {
  let count = 0;
  let currentId = chapter.rootId;

  while (true) {
    const node = chapter.nodes[currentId];

    if (!node) {
      break;
    }

    const nextId = node.children[0];

    if (!nextId) {
      break;
    }

    count += 1;
    currentId = nextId;
  }

  return count;
}

console.log("=== LICHESS STUDY SILENT-TRUNCATION TEST ===");
console.log();

console.log(`Parsed chapters/games: ${games.length}`);
console.log();

for (const [index, game] of games.entries()) {
  const name =
    game.headers.ChapterName ??
    game.headers.Opening ??
    game.headers.Event ??
    `Imported ${index + 1}`;

  if (game.moves.length === 0) {
    emptyChapters++;
    continue;
  }

  const chapter = chapterFromGame(game, name);

  playableChapters++;

  const importedMainlineMoves = countMainlineNodes(chapter);
  const expectedMainlineMoves = game.moves.length;

  const nodeCount = Object.keys(chapter.nodes).length;

  const commentCount = Object.values(chapter.nodes).filter(
    (node) => Boolean(node.comment?.trim()),
  ).length;

  const branchCount = Object.values(chapter.nodes).reduce(
    (total, node) => total + Math.max(0, node.children.length - 1),
    0,
  );

  totalImportedNodes += nodeCount;
  totalComments += commentCount;
  totalBranches += branchCount;

  if (importedMainlineMoves !== expectedMainlineMoves) {
    truncatedChapters++;

    console.log("⚠️ POSSIBLE TRUNCATION");
    console.log(`   Chapter: ${name}`);
    console.log(`   Expected mainline moves: ${expectedMainlineMoves}`);
    console.log(`   Imported mainline moves: ${importedMainlineMoves}`);
    console.log();
  }
}

console.log("=== SUMMARY ===");
console.log(`Parsed chapters:          ${games.length}`);
console.log(`Playable chapters:        ${playableChapters}`);
console.log(`Empty chapters:           ${emptyChapters}`);
console.log(`Total imported nodes:     ${totalImportedNodes}`);
console.log(`Total comments:           ${totalComments}`);
console.log(`Total branches:           ${totalBranches}`);
console.log(`Possible truncations:     ${truncatedChapters}`);
console.log();

if (truncatedChapters === 0) {
  console.log("✅ NO MAINLINE TRUNCATION DETECTED");
} else {
  console.log("❌ POSSIBLE TRUNCATION DETECTED");
}

console.log();
console.log("=== TEST COMPLETE ===");