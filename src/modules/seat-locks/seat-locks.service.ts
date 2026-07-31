import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateSeatLockDto } from './dto/create-seat-lock.dto';

@Injectable()
export class SeatLocksService {
  constructor(private prisma: PrismaService) {}

  /*
   * Lock seat
   */

  async lockSeats(userId: string, dto: CreateSeatLockDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const now = new Date();

        await tx.seatLock.deleteMany({
          where: {
            expiresAt: {
              lte: now,
            },
          },
        });

        const showtime = await tx.showtime.findUnique({
          where: { id: dto.showtimeId },
          select: { roomId: true },
        });

        if (!showtime) {
          throw new BadRequestException('Showtime not found');
        }

        const seats = await tx.seat.findMany({
          where: {
            id: { in: dto.seatIds },
            roomId: showtime.roomId,
          },
          select: { id: true },
        });

        if (seats.length !== dto.seatIds.length) {
          throw new BadRequestException('Invalid seat for this showtime');
        }

        const booked = await tx.bookingSeat.findFirst({
          where: {
            seatId: {
              in: dto.seatIds,
            },
            booking: {
              showtimeId: dto.showtimeId,
              status: {
                in: ['PENDING', 'PAID'],
              },
            },
          },
        });

        if (booked) {
          throw new BadRequestException('Seat already booked');
        }

        // Any active lock is a conflict, including a previous lock created by
        // the same user. A seat cannot belong to two booking attempts.
        const conflictingLock = await tx.seatLock.findFirst({
          where: {
            showtimeId: dto.showtimeId,
            seatId: {
              in: dto.seatIds,
            },
            expiresAt: {
              gt: now,
            },
          },
        });

        if (conflictingLock) {
          throw new BadRequestException('Seat already locked');
        }

        // Each booking attempt starts a separate 15-minute lock.
        const expires = new Date(now.getTime() + 15 * 60 * 1000);

        await tx.seatLock.createMany({
          data: dto.seatIds.map((seatId) => ({
            userId,
            seatId,
            showtimeId: dto.showtimeId,
            expiresAt: expires,
          })),
        });

        return {
          success: true,
          expiresAt: expires,
          seatIds: dto.seatIds,
        };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Seat already locked');
      }

      throw error;
    }
  }

  /*
   * Unlock
   */

  async unlockSeats(userId: string, dto: CreateSeatLockDto) {
    await this.prisma.seatLock.deleteMany({
      where: {
        userId,

        showtimeId: dto.showtimeId,

        seatId: {
          in: dto.seatIds,
        },
      },
    });

    return {
      success: true,
    };
  }
}
