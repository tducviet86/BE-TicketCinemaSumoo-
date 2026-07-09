import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateShowtimeDto {
  @IsString()
  movieId!: string;

  @IsString()
  roomId!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsNumber()
  price!: number;
}
