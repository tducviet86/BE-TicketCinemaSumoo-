import { Injectable, NotFoundException } from '@nestjs/common';
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
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        cinema: true,
        seats: true,
        showtimes: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
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
