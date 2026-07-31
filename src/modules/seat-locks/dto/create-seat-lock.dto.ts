import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class CreateSeatLockDto {
  @IsUUID()
  showtimeId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', {
    each: true,
  })
  seatIds!: string[];
}
