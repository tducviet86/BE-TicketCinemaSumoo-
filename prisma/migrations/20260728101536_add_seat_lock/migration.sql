/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId,seatId]` on the table `BookingSeat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ticketCode]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `BookingSeat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageRating` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketCode` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AgeRating" AS ENUM ('P', 'K', 'T13', 'T16', 'T18', 'C18');

-- AlterTable
ALTER TABLE "BookingSeat" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "ageRating" "AgeRating" NOT NULL;

-- AlterTable
ALTER TABLE "Seat" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "qrCode",
ADD COLUMN     "ticketCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_bookingId_seatId_key" ON "BookingSeat"("bookingId", "seatId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketCode_key" ON "Ticket"("ticketCode");

-- AddForeignKey
ALTER TABLE "SeatLock" ADD CONSTRAINT "SeatLock_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatLock" ADD CONSTRAINT "SeatLock_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
