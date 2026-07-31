import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateShowtimeDto) {
    return this.prisma.showtime.create({
      data: {
        movieId: dto.movieId,
        roomId: dto.roomId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });
  }

  findAll() {
    return this.prisma.showtime.findMany({
      include: {
        movie: true,
        room: {
          include: {
            cinema: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
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
      throw new NotFoundException('Showtime not found');
    }

    return showtime;
  }

  async update(id: string, dto: UpdateShowtimeDto) {
    await this.findOne(id);

    return this.prisma.showtime.update({
      where: { id },
      data: {
        movieId: dto.movieId,
        roomId: dto.roomId,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.showtime.delete({
      where: { id },
    });
  }

  // Showtimes by movie
  findByMovie(movieId: string) {
    return this.prisma.showtime.findMany({
      where: {
        movieId,
      },
      include: {
        room: {
          include: {
            cinema: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  // Showtimes by room
  findByRoom(roomId: string) {
    return this.prisma.showtime.findMany({
      where: {
        roomId,
      },
      include: {
        movie: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  // Booked seat ids
  async getBookedSeats(showtimeId: string) {
    const booked = await this.prisma.bookingSeat.findMany({
      where: {
        booking: {
          showtimeId,
          status: {
            in: ['PAID', 'PENDING'],
          },
        },
      },
      select: {
        seatId: true,
      },
    });

    return booked.map((item) => item.seatId);
  }

  // Seat Map (Movie + Cinema + Room + Showtime + Seats)
  async getSeatMap(showtimeId: string, userId: string) {
    const now = new Date();

    // Xóa lock hết hạn
    await this.prisma.seatLock.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    const showtime = await this.prisma.showtime.findUnique({
      where: {
        id: showtimeId,
      },
      include: {
        movie: true,
        room: {
          include: {
            cinema: true,
            seats: {
              orderBy: [
                {
                  row: 'asc',
                },
                {
                  number: 'asc',
                },
              ],
            },
          },
        },
      },
    });

    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    /*
     * Ghế đã thanh toán
     */

    const bookedSeats = await this.prisma.bookingSeat.findMany({
      where: {
        booking: {
          showtimeId,
          status: 'PAID',
        },
      },
      select: {
        seatId: true,
      },
    });

    const bookedSet = new Set(bookedSeats.map((i) => i.seatId));

    /*
     * Ghế đang lock
     */

    const lockedSeats = await this.prisma.seatLock.findMany({
      where: {
        showtimeId,
        expiresAt: {
          gt: now,
        },
      },
      select: {
        seatId: true,
        userId: true,
      },
    });

    const lockedSet = new Set(lockedSeats.map((i) => i.seatId));
    const heldByMeSet = new Set(lockedSeats.filter((lock) => lock.userId === userId).map((lock) => lock.seatId));

    return {
      movie: showtime.movie,

      cinema: showtime.room.cinema,

      room: {
        id: showtime.room.id,
        name: showtime.room.name,
      },

      showtime: {
        id: showtime.id,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
      },

      seats: showtime.room.seats.map((seat) => {
        let status: 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'HELD_BY_ME' = 'AVAILABLE';

        if (bookedSet.has(seat.id)) {
          status = 'BOOKED';
        } else if (heldByMeSet.has(seat.id)) {
          status = 'HELD_BY_ME';
        } else if (lockedSet.has(seat.id)) {
          status = 'LOCKED';
        }

        return {
          ...seat,
          status,
        };
      }),
    };
  }
}
