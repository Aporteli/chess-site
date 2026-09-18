import fs from "node:fs/promises";
import { parsePgn } from "../src/lib/chess/png/pgnAST";

async function main() {
  const file = "data/lichess-studies.pgn";

  const pgn = await fs.readFile(file, "utf8");
  const games = parsePgn(pgn);

  console.log("\n=== LICHESS STUDY IMPORT TEST ===\n");

  // 1. Number of chapters/games
  console.log(`1. Parsed chapters/games: ${games.length}`);

  // 2. Chapter names
  console.log("\n2. Chapter names:");
  games.forEach((game, index) => {
    console.log(
      `   ${index + 1}. ${game.headers.ChapterName ?? "(no ChapterName)"}`
    );
  });

  // 3. Comments
  let commentCount = 0;

  for (const game of games) {
    for (const move of game.moves) {
      if (move.comment) commentCount++;

      for (const variation of move.variations) {
        commentCount += variation.filter((move) => Boolean(move.comment)).length;
      }
    }
  }

  console.log(`\n3. Comments found: ${commentCount}`);

  // 4. Variations
  let variationCount = 0;

  function countVariations(
    moves: typeof games[number]["moves"]
  ): number {
    let count = 0;

    for (const move of moves) {
      count += move.variations.length;

      for (const variation of move.variations) {
        count += countVariations(variation);
      }
    }

    return count;
  }

  for (const game of games) {
    variationCount += countVariations(game.moves);
  }

  console.log(`4. Variations found: ${variationCount}`);

  // 5. Chapters with playable moves
  const playable = games.filter((game) => game.moves.length > 0);
  const empty = games.filter((game) => game.moves.length === 0);

  console.log(
    `\n5. Playable chapters: ${playable.length}/${games.length}`
  );

  if (empty.length > 0) {
    console.log("   Chapters without moves:");

    for (const game of empty) {
      console.log(
        `   - ${game.headers.ChapterName ?? "(unnamed chapter)"}`
      );
    }
  }

  // 6. Basic parsing failures / suspicious chapters
  const suspicious = games.filter(
    (game) =>
      !game.headers.ChapterName ||
      game.moves.length === 0
  );

  console.log(`\n6. Suspicious chapters: ${suspicious.length}`);

  if (suspicious.length > 0) {
    for (const game of suspicious) {
      console.log(
        `   - ${game.headers.ChapterName ?? "(missing ChapterName)"}`
      );
    }
  }

  console.log("\n=== TEST COMPLETE ===\n");
}

main().catch((error) => {
  console.error("\nTEST FAILED\n");
  console.error(error);
  process.exit(1);
});