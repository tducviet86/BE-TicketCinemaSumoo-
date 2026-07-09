import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { AddGenreToMovieDto } from './dto/add-genre-to-movie.dto';

@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }

  @Post('add-to-movie')
  addGenreToMovie(@Body() dto: AddGenreToMovieDto) {
    return this.genresService.addGenreToMovie(dto);
  }

  @Delete('remove-from-movie/:movieId/:genreId')
  removeGenreFromMovie(@Param('movieId') movieId: string, @Param('genreId') genreId: string) {
    return this.genresService.removeGenreFromMovie(movieId, genreId);
  }
}
