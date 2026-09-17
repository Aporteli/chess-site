/*
  Warnings:

  - A unique constraint covering the columns `[seq]` on the table `Puzzle` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Puzzle" ADD COLUMN     "seq" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Puzzle_seq_key" ON "Puzzle"("seq");
