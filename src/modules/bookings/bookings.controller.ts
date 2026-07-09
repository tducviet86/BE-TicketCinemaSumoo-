import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  createBooking(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.sub, dto);
  }

  @Get('me')
  getMyBookings(@Req() req) {
    return this.bookingsService.getMyBookings(req.user.sub);
  }

  @Get(':id')
  getBooking(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Patch(':id/cancel')
  cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }
}
