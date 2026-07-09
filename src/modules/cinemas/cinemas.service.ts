import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCinemaDto) {
    return this.prisma.cinema.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.cinema.findMany({
      include: {
        rooms: true,
      },
    });
  }

  async findOne(id: string) {
    const cinema = await this.prisma.cinema.findUnique({
      where: { id },
      include: {
        rooms: true,
      },
    });

    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }

    return cinema;
  }

  async update(id: string, dto: UpdateCinemaDto) {
    await this.findOne(id);

    return this.prisma.cinema.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.cinema.delete({
      where: { id },
    });
  }
}
