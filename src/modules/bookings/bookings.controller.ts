import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Post('confirm')
  confirm(@Req() req, @Body() dto: ConfirmBookingDto) {
    return this.bookingService.confirmBooking(req.user.id, dto);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(req.user.id, dto);
  }

  @Get('me')
  getMine(@Req() req) {
    return this.bookingService.getMyBookings(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.bookingService.cancelBooking(id);
  }
}
