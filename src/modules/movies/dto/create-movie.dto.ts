import { IsString, IsInt, IsOptional, IsArray, IsNumber, IsDateString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  duration!: number;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsArray()
  genreIds?: string[];
}
