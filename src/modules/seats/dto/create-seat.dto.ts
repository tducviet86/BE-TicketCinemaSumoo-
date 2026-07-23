import { IsEnum, IsInt, IsString } from 'class-validator';
import { SeatType } from '@prisma/client';

export class CreateSeatDto {
  @IsString()
  code!: string;

  @IsString()
  row!: string;

  @IsInt()
  number!: number;

  @IsEnum(SeatType)
  type!: SeatType;

  @IsInt()
  price!: number;

  @IsString()
  roomId!: string;
}
