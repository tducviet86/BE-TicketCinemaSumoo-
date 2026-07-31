import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateSeatLockDto } from './dto/create-seat-lock.dto';

@Injectable()
export class SeatLocksService {
  constructor(private prisma: PrismaService) {}

  /*
   * Remove expired lock
   */

  private async clearExpiredLocks() {
    await this.prisma.seatLock.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /*
   * Lock seat
   */

  async lockSeats(userId: string, dto: CreateSeatLockDto) {
    await this.clearExpiredLocks();

    return this.prisma.$transaction(async (tx) => {
      /*
       * booked
       */

      const booked = await tx.bookingSeat.findMany({
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

      if (booked.length) {
        throw new BadRequestException('Seat already booked');
      }

      /*
       * locked
       */

      const locked = await tx.seatLock.findMany({
        where: {
          showtimeId: dto.showtimeId,

          seatId: {
            in: dto.seatIds,
          },
        },
      });

      if (locked.length) {
        throw new BadRequestException('Seat already locked');
      }

      // The database expiration is authoritative even if the client closes.
      const expires = new Date(Date.now() + 4 * 60 * 1000);

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
      };
    });
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
