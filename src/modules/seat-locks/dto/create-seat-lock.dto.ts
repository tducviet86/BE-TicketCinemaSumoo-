import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateSeatLockDto {
  @IsUUID()
  showtimeId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', {
    each: true,
  })
  seatIds!: string[];
}
