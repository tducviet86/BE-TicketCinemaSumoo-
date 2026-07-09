import { IsString } from 'class-validator';

export class AddGenreToMovieDto {
  @IsString()
  movieId!: string;

  @IsString()
  genreId!: string;
}
