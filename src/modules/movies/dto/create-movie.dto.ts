import { IsString, IsInt, IsOptional, IsArray, IsNumber, IsDateString } from 'class-validator';
import { AgeRating } from '@prisma/client';
import { IsEnum } from 'class-validator';
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

  @IsEnum(AgeRating as object)
  ageRating!: AgeRating;

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
