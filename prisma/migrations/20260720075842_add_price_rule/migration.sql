/*
  Warnings:

  - You are about to drop the column `isHoliday` on the `PriceRule` table. All the data in the column will be lost.
  - Added the required column `name` to the `PriceRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PriceRule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PriceRule_dayOfWeek_seatType_key";

-- AlterTable
ALTER TABLE "PriceRule" DROP COLUMN "isHoliday",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endHour" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "specialDate" TIMESTAMP(3),
ADD COLUMN     "startHour" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "dayOfWeek" DROP NOT NULL;
