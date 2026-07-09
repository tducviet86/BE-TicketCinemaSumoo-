import { IsOptional, IsString, IsInt, IsNumber, IsArray, IsDateString } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  posterUrl?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsArray()
  genreIds?: string[];
}
