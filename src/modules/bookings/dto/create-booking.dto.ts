import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  showtimeId!: string;

  @IsArray()
  seatIds!: string[];

  @IsNumber()
  totalPrice!: number;
}
