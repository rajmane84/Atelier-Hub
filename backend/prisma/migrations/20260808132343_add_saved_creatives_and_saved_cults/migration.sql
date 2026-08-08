-- CreateTable
CREATE TABLE "SavedCreative" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creativeProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCreative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cultId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedCreative_userId_idx" ON "SavedCreative"("userId");

-- CreateIndex
CREATE INDEX "SavedCreative_creativeProfileId_idx" ON "SavedCreative"("creativeProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCreative_userId_creativeProfileId_key" ON "SavedCreative"("userId", "creativeProfileId");

-- CreateIndex
CREATE INDEX "SavedCult_userId_idx" ON "SavedCult"("userId");

-- CreateIndex
CREATE INDEX "SavedCult_cultId_idx" ON "SavedCult"("cultId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCult_userId_cultId_key" ON "SavedCult"("userId", "cultId");

-- AddForeignKey
ALTER TABLE "SavedCreative" ADD CONSTRAINT "SavedCreative_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCreative" ADD CONSTRAINT "SavedCreative_creativeProfileId_fkey" FOREIGN KEY ("creativeProfileId") REFERENCES "CreativeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCult" ADD CONSTRAINT "SavedCult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCult" ADD CONSTRAINT "SavedCult_cultId_fkey" FOREIGN KEY ("cultId") REFERENCES "Cult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
