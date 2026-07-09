import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        bookingId: dto.bookingId,
        qrCode: dto.qrCode || `TICKET-${dto.bookingId}`,
      },
    });
  }

  findAll() {
    return this.prisma.ticket.findMany({
      include: {
        booking: {
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
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        booking: {
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
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  findByBooking(bookingId: string) {
    return this.prisma.ticket.findUnique({
      where: { bookingId },
    });
  }
}
