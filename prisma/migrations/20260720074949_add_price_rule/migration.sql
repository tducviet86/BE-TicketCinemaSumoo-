/*
  Warnings:

  - You are about to drop the column `price` on the `Showtime` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "Showtime" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "PriceRule" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "seatType" "SeatType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PriceRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceRule_dayOfWeek_seatType_key" ON "PriceRule"("dayOfWeek", "seatType");
