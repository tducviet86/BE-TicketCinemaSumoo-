import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  // USER
  @Get('booking/:bookingId')
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.ticketsService.findByBooking(bookingId);
  }

  // ADMIN xem tất cả ticket
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  // ADMIN
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  // ADMIN
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }
}
