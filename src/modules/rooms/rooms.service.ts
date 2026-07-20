import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.room.findMany({
      include: {
        cinema: true,
        seats: true,
        showtimes: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.showtime.findUnique({
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
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.findOne(id);

    return this.prisma.room.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.room.delete({
      where: { id },
    });
  }

  // get rooms by cinema
  findByCinema(cinemaId: string) {
    return this.prisma.room.findMany({
      where: { cinemaId },
    });
  }
}
