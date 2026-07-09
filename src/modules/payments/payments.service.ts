import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus, BookingStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    if (booking.status === BookingStatus.PAID) {
      throw new BadRequestException('Booking already paid');
    }

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        method: dto.method,
        status: PaymentStatus.SUCCESS,
      },
    });

    await this.prisma.booking.update({
      where: { id: dto.bookingId },
      data: { status: BookingStatus.PAID },
    });

    await this.prisma.ticket.create({
      data: {
        bookingId: dto.bookingId,
        qrCode: `TICKET-${dto.bookingId}`,
      },
    });

    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: {
        booking: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    });
  }
}
