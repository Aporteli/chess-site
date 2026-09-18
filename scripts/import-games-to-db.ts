import 'dotenv/config';
import fs from 'node:fs/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const dbUrl = requiredEnv('DATABASE_URL');
const userEmail = requiredEnv('IMPORT_USER_EMAIL');

console.log(`✓ DB_URL found`);
console.log(`✓ USER_EMAIL = ${userEmail}`);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: dbUrl }),
});

async function main() {
  // 1. მოძებნე ან შექმენი user
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: userEmail.split('@')[0],
      password: '',
    },
  });

  console.log(`\n👤 User: ${user.email} (id=${user.id})\n`);

  // 2. წაიკითხე PGN
  const pgn = await fs.readFile('data/lichess-games.pgn', 'utf-8');
  const games = pgn.split(/\n\n(?=\[Event )/).filter(Boolean);
  console.log(`📄 Found ${games.length} games in PGN\n`);

  // 3. ჩაწერე ბაზაში
  let saved = 0;
  let skipped = 0;

  for (const gamePgn of games) {
    const headers: Record<string, string> = {};
    for (const m of gamePgn.matchAll(/\[(\w+)\s+"([^"]*)"\]/g)) {
      headers[m[1]] = m[2];
    }

    if (!headers.White || !headers.Black) {
      skipped++;
      continue;
    }

    const title = [
      headers.White,
      'vs',
      headers.Black,
      headers.Opening ? `· ${headers.Opening}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    try {
      await prisma.play.create({
        data: {
          userId: user.id,
          title,
          source: 'lichess',
          white: headers.White,
          black: headers.Black,
          result: headers.Result ?? '*',
          pgn: gamePgn,
          startFen:
            headers.FEN ??
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        },
      });
      saved++;
      if (saved % 50 === 0) console.log(`  ✓ saved ${saved}...`);
    } catch (err) {
      console.error(`  ✗ Game #${saved + skipped + 1} failed:`, err);
      skipped++;
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Saved:   ${saved}`);
  console.log(`   Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error('❌', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());