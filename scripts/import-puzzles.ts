import "dotenv/config";
import fs from "node:fs";
import readline from "node:readline";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const BATCH_SIZE = 1000;

type PuzzleInput = {
  id: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
};

async function main() {
  const file = 'data/puzzles.jsonl';

  if (!fs.existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }

  const stream = fs.createReadStream(file, { encoding: 'utf8' });

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let batch: PuzzleInput[] = [];
  let imported = 0;
  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;

    if (!line.trim()) continue;

    const puzzle = JSON.parse(line) as PuzzleInput;

    if (
      typeof puzzle.id !== 'string' ||
      typeof puzzle.fen !== 'string' ||
      typeof puzzle.moves !== 'string' ||
      typeof puzzle.rating !== 'number' ||
      !Array.isArray(puzzle.themes)
    ) {
      throw new Error(`Invalid puzzle at line ${lineNumber}`);
    }

    batch.push(puzzle);

    if (batch.length >= BATCH_SIZE) {
      await prisma.puzzle.createMany({
        data: batch,
        skipDuplicates: true,
      });

      imported += batch.length;
      console.log(`Imported: ${imported}`);

      batch = [];
    }
  }

  if (batch.length > 0) {
    await prisma.puzzle.createMany({
      data: batch,
      skipDuplicates: true,
    });

    imported += batch.length;
  }

  console.log(`\nImport finished.`);
  console.log(`Processed: ${imported.toLocaleString()} puzzles`);

  const total = await prisma.puzzle.count();
  console.log(`Total in database: ${total.toLocaleString()}`);
}

main()
  .catch((error) => {
    console.error('Import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
