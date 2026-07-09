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
        price: dto.price,
      },
    });
  }

  findAll() {
    return this.prisma.showtime.findMany({
      include: {
        movie: true,
        room: true,
      },
    });
  }

  async findOne(id: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        room: true,
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
        price: dto.price,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.showtime.delete({
      where: { id },
    });
  }

  // showtimes by movie
  findByMovie(movieId: string) {
    return this.prisma.showtime.findMany({
      where: { movieId },
    });
  }

  // showtimes by room
  findByRoom(roomId: string) {
    return this.prisma.showtime.findMany({
      where: { roomId },
    });
  }

  // booked seats by showtime (VERY IMPORTANT)
  getBookedSeats(showtimeId: string) {
    return this.prisma.bookingSeat.findMany({
      where: {
        booking: {
          showtimeId,
        },
      },
      select: {
        seatId: true,
      },
    });
  }
}
