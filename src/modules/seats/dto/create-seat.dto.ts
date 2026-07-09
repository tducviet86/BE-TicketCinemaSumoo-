import { IsString, IsInt, IsEnum } from 'class-validator';
import { SeatType } from '@prisma/client';

export class CreateSeatDto {
  @IsString()
  row!: string;

  @IsInt()
  number!: number;

  @IsEnum(SeatType)
  type!: SeatType;

  @IsString()
  roomId!: string;
}
