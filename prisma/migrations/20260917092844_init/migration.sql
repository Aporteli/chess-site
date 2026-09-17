-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Play" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "source" TEXT NOT NULL DEFAULT 'analysis',
    "white" TEXT,
    "black" TEXT,
    "result" TEXT NOT NULL DEFAULT '*',
    "pgn" TEXT NOT NULL DEFAULT '',
    "startFen" TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    "currentFen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Play_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puzzles" (
    "puzzle_id" TEXT NOT NULL,
    "fen" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "rating_deviation" INTEGER NOT NULL,
    "popularity" INTEGER NOT NULL,
    "nb_plays" INTEGER NOT NULL,
    "themes" TEXT NOT NULL,
    "game_url" TEXT,
    "opening_tags" TEXT,

    CONSTRAINT "puzzles_pkey" PRIMARY KEY ("puzzle_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Play_userId_createdAt_idx" ON "Play"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "puzzles_rating_idx" ON "puzzles"("rating");

-- CreateIndex
CREATE INDEX "puzzles_popularity_idx" ON "puzzles"("popularity");

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
