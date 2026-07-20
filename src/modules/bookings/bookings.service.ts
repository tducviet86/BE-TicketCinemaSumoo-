import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: dto.showtimeId },
    });

    if (!showtime) {
      throw new BadRequestException('Showtime not found');
    }

    // check seat already booked
    const existingSeats = await this.prisma.bookingSeat.findMany({
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

    if (existingSeats.length > 0) {
      throw new BadRequestException('Some seats already booked');
    }

    // create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        showtimeId: dto.showtimeId,
        totalPrice: dto.totalPrice,
        seats: {
          create: dto.seatIds.map((seatId) => ({
            seatId,
          })),
        },
      },
      include: {
        seats: true,
        showtime: true,
      },
    });

    return booking;
  }

  async getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        showtime: {
          include: {
            movie: true,
            room: true,
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

  async getBookingById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        showtime: {
          include: {
            movie: true,
            room: true,
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

  async cancelBooking(id: string) {
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}
