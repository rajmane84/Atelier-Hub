/*
  Warnings:

  - You are about to drop the column `disciplines` on the `CreativeProfile` table. All the data in the column will be lost.
  - You are about to drop the column `discipline` on the `Listing` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Listing_discipline_idx";

-- AlterTable
ALTER TABLE "CreativeProfile" DROP COLUMN "disciplines";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "discipline";

-- DropEnum
DROP TYPE "Discipline";
