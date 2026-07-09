import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private showtimesService: ShowtimesService) {}

  // Public
  @Get()
  findAll() {
    return this.showtimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(id);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId') movieId: string) {
    return this.showtimesService.findByMovie(movieId);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId') roomId: string) {
    return this.showtimesService.findByRoom(roomId);
  }

  @Get(':id/booked-seats')
  getBookedSeats(@Param('id') id: string) {
    return this.showtimesService.getBookedSeats(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimesService.create(dto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShowtimeDto) {
    return this.showtimesService.update(id, dto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(id);
  }
}
