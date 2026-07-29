import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  /*
   * Create Booking
   */

  async createBooking(userId: string, dto: CreateBookingDto) {
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      // kiểm tra lock

      const locks = await tx.seatLock.findMany({
        where: {
          userId,
          showtimeId: dto.showtimeId,
          seatId: {
            in: dto.seatIds,
          },
          expiresAt: {
            gt: now,
          },
        },
      });

      if (locks.length !== dto.seatIds.length) {
        throw new BadRequestException('Seat lock expired');
      }

      // kiểm tra ghế đã book

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

      // lấy giá ghế

      const seats = await tx.seat.findMany({
        where: {
          id: {
            in: dto.seatIds,
          },
        },
      });

      if (seats.length !== dto.seatIds.length) {
        throw new BadRequestException('Seat not found');
      }

      const ticketTotal = seats.reduce((sum, seat) => sum + seat.price, 0);

      const serviceFee = 5000;

      const total = ticketTotal + serviceFee;

      // tạo booking

      const booking = await tx.booking.create({
        data: {
          userId,

          showtimeId: dto.showtimeId,

          totalPrice: total,

          status: 'PENDING',

          seats: {
            create: seats.map((seat) => ({
              seatId: seat.id,
              price: seat.price,
            })),
          },
        },

        include: {
          showtime: {
            include: {
              movie: true,
            },
          },

          seats: {
            include: {
              seat: true,
            },
          },
        },
      });

      // xoá lock

      await tx.seatLock.deleteMany({
        where: {
          userId,
          showtimeId: dto.showtimeId,
          seatId: {
            in: dto.seatIds,
          },
        },
      });

      return booking;
    });
  }

  /*
   * Confirm Booking
   */

  async confirmBooking(userId: string, dto: ConfirmBookingDto) {
    const now = new Date();

    const showtime = await this.prisma.showtime.findUnique({
      where: {
        id: dto.showtimeId,
      },
      include: {
        movie: true,
        room: {
          include: {
            cinema: true,
          },
        },
      },
    });

    if (!showtime) {
      throw new BadRequestException('Showtime not found');
    }

    const seats = await this.prisma.seat.findMany({
      where: {
        id: {
          in: dto.seatIds,
        },
      },
      orderBy: [
        {
          row: 'asc',
        },
        {
          number: 'asc',
        },
      ],
    });

    const locks = await this.prisma.seatLock.findMany({
      where: {
        userId,
        showtimeId: dto.showtimeId,
        seatId: {
          in: dto.seatIds,
        },
        expiresAt: {
          gt: now,
        },
      },
    });

    if (locks.length !== dto.seatIds.length) {
      throw new BadRequestException('Seat lock expired');
    }

    const ticketTotal = seats.reduce((sum, seat) => sum + seat.price, 0);

    const serviceFee = 5000;

    const total = ticketTotal + serviceFee;

    return {
      movie: {
        id: showtime.movie.id,
        title: showtime.movie.title,
        poster: showtime.movie.posterUrl,
        duration: showtime.movie.duration,
        ageRating: showtime.movie.ageRating,
      },

      cinema: showtime.room.cinema,

      room: showtime.room,

      showtime: {
        id: showtime.id,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
      },

      seats,

      seatCodes: seats.map((s) => s.code),

      payment: {
        quantity: seats.length,

        ticketTotal,

        serviceFee,

        total,
      },

      expiresAt: locks[0].expiresAt,
    };
  }

  /*
   * My Booking
   */

  async getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        showtime: {
          include: {
            movie: true,
            room: {
              include: {
                cinema: true,
              },
            },
          },
        },

        seats: {
          include: {
            seat: true,
          },
        },

        payment: true,

        ticket: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /*
   * Booking Detail
   */

  async getBookingById(id: string) {
    return this.prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        showtime: {
          include: {
            movie: true,
            room: {
              include: {
                cinema: true,
              },
            },
          },
        },

        seats: {
          include: {
            seat: true,
          },
        },

        payment: true,

        ticket: true,
      },
    });
  }

  /*
   * Cancel
   */

  async cancelBooking(id: string) {
    return this.prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}
