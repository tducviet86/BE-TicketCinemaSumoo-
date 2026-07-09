import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  @Post()
  create(@Body() dto: CreateSeatDto) {
    return this.seatsService.create(dto);
  }

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSeatDto) {
    return this.seatsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatsService.remove(id);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId') roomId: string) {
    return this.seatsService.findByRoom(roomId);
  }
}
