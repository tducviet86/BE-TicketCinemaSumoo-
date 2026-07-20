import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSeatDto) {
    return this.prisma.seat.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.seat.findMany({
      include: {
        room: true,
      },
    });
  }

  async findOne(id: string) {
    const seat = await this.prisma.seat.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });

    if (!seat) {
      throw new NotFoundException('Seat not found');
    }

    return seat;
  }

  async update(id: string, dto: UpdateSeatDto) {
    await this.findOne(id);

    return this.prisma.seat.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.seat.delete({
      where: { id },
    });
  }

  // get seats by room
  findByRoom(roomId: string) {
    return this.prisma.seat.findMany({
      where: {
        roomId,
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
  }
}
