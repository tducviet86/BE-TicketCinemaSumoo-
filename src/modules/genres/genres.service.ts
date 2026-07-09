import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { AddGenreToMovieDto } from './dto/add-genre-to-movie.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateGenreDto) {
    return this.prisma.genre.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.genre.findMany({
      include: {
        movies: {
          include: {
            movie: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    await this.findOne(id);

    return this.prisma.genre.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.genre.delete({
      where: { id },
    });
  }

  // Add genre to movie
  addGenreToMovie(dto: AddGenreToMovieDto) {
    return this.prisma.movieGenre.create({
      data: {
        movieId: dto.movieId,
        genreId: dto.genreId,
      },
    });
  }

  // Remove genre from movie
  removeGenreFromMovie(movieId: string, genreId: string) {
    return this.prisma.movieGenre.delete({
      where: {
        movieId_genreId: {
          movieId,
          genreId,
        },
      },
    });
  }
}
