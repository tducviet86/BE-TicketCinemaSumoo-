import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { SeatType } from '@prisma/client';

export class UpdateSeatDto {
  @IsOptional()
  @IsString()
  row?: string;

  @IsOptional()
  @IsInt()
  number?: number;

  @IsOptional()
  @IsEnum(SeatType)
  type?: SeatType;

  @IsOptional()
  @IsString()
  roomId?: string;
}
