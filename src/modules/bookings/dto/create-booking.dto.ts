import { IsString, IsArray } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  showtimeId!: string;

  @IsArray()
  seatIds!: string[];
}
