import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: {
        title: dto.title,
        description: dto.description,
        duration: dto.duration,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
        language: dto.language,
        trailerUrl: dto.trailerUrl,
        posterUrl: dto.posterUrl,
        rating: dto.rating,
        genres: dto.genreIds
          ? {
              create: dto.genreIds.map((genreId) => ({
                genre: { connect: { id: genreId } },
              })),
            }
          : undefined,
      },
      include: {
        genres: { include: { genre: true } },
      },
    });
  }

  async findAll(page: number) {
    const take = 10;
    const skip = (page - 1) * take;

    return this.prisma.movie.findMany({
      skip,
      take,
      include: {
        genres: { include: { genre: true } },
        showtimes: true,
      },
    });
  }

  async findNowShowing() {
    const now = new Date();

    return this.prisma.movie.findMany({
      where: {
        showtimes: {
          some: {
            startTime: { gte: now },
          },
        },
      },
      include: {
        genres: { include: { genre: true } },
        showtimes: true,
      },
    });
  }

  async findUpcoming() {
    return this.prisma.movie.findMany({
      where: {
        showtimes: {
          none: {},
        },
      },
      include: {
        genres: { include: { genre: true } },
      },
    });
  }

  async search(keyword: string) {
    return this.prisma.movie.findMany({
      where: {
        title: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByGenre(genreId: string) {
    return this.prisma.movie.findMany({
      where: {
        genres: {
          some: { genreId },
        },
      },
      include: {
        genres: { include: { genre: true } },
      },
    });
  }

  async getShowtimes(movieId: string) {
    return this.prisma.showtime.findMany({
      where: { movieId },
      include: {
        room: true,
      },
    });
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        showtimes: {
          include: {
            room: {
              include: {
                cinema: true,
              },
            },
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(id: string, dto: UpdateMovieDto) {
    await this.findOne(id);

    if (dto.genreIds) {
      await this.prisma.movieGenre.deleteMany({
        where: { movieId: id },
      });

      await this.prisma.movieGenre.createMany({
        data: dto.genreIds.map((genreId) => ({
          movieId: id,
          genreId,
        })),
      });
    }

    return this.prisma.movie.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        duration: dto.duration,
        rating: dto.rating,
        posterUrl: dto.posterUrl,
        trailerUrl: dto.trailerUrl,
        language: dto.language,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
