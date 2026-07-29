import { IsArray, IsString } from 'class-validator';

export class ConfirmBookingDto {
  @IsString()
  showtimeId!: string;

  @IsArray()
  seatIds!: string[];
}
