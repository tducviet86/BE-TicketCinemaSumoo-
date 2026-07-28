/*
  Warnings:

  - A unique constraint covering the columns `[seatId,showtimeId]` on the table `SeatLock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `SeatLock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeatLock" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SeatLock_expiresAt_idx" ON "SeatLock"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SeatLock_seatId_showtimeId_key" ON "SeatLock"("seatId", "showtimeId");

-- AddForeignKey
ALTER TABLE "SeatLock" ADD CONSTRAINT "SeatLock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
