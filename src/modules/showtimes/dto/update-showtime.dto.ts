import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateShowtimeDto {
  @IsOptional()
  @IsString()
  movieId?: string;

  @IsOptional()
  @IsString()
  roomId?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
