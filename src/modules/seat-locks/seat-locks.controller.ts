import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { SeatLocksService } from './seat-locks.service';

import { CreateSeatLockDto } from './dto/create-seat-lock.dto';

@Controller('seat-locks')
@UseGuards(JwtAuthGuard)
export class SeatLocksController {
  constructor(private readonly seatLockService: SeatLocksService) {}

  @Post()
  lockSeats(@Req() req, @Body() dto: CreateSeatLockDto) {
    return this.seatLockService.lockSeats(req.user.id, dto);
  }

  @Delete()
  unlockSeats(@Req() req, @Body() dto: CreateSeatLockDto) {
    return this.seatLockService.unlockSeats(req.user.id, dto);
  }
}
