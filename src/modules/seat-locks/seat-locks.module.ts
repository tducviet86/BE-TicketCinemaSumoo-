import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { SeatLocksController } from './seat-locks.controller';
import { SeatLocksService } from './seat-locks.service';

@Module({
  controllers: [SeatLocksController],

  providers: [SeatLocksService, PrismaService],
})
export class SeatLocksModule {}
