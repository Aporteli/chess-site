/*
  Warnings:

  - You are about to drop the `puzzles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "puzzles";

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "fen" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "themes" TEXT[],

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Puzzle_rating_idx" ON "Puzzle"("rating");
