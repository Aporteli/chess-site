-- CreateTable
CREATE TABLE "Repertoire" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repertoire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "repertoireId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eco" TEXT NOT NULL DEFAULT '',
    "variation" TEXT NOT NULL DEFAULT '',
    "rootId" TEXT NOT NULL,
    "startFen" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Repertoire_userId_updatedAt_idx" ON "Repertoire"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Chapter_repertoireId_idx" ON "Chapter"("repertoireId");

-- AddForeignKey
ALTER TABLE "Repertoire" ADD CONSTRAINT "Repertoire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_repertoireId_fkey" FOREIGN KEY ("repertoireId") REFERENCES "Repertoire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
