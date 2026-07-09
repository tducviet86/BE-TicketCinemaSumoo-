import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  // 🎬 tất cả phim (pagination)
  @Get()
  findAll(@Query('page') page = 1) {
    return this.moviesService.findAll(Number(page));
  }

  // 🎬 đang chiếu
  @Get('now-showing')
  findNowShowing() {
    return this.moviesService.findNowShowing();
  }

  // ⏳ sắp chiếu
  @Get('upcoming')
  findUpcoming() {
    return this.moviesService.findUpcoming();
  }

  // 🔍 search
  @Get('search/:keyword')
  search(@Param('keyword') keyword: string) {
    return this.moviesService.search(keyword);
  }

  // 🎭 theo thể loại
  @Get('genre/:id')
  findByGenre(@Param('id') id: string) {
    return this.moviesService.findByGenre(id);
  }

  // 🕒 showtimes theo phim
  @Get(':id/showtimes')
  getShowtimes(@Param('id') id: string) {
    return this.moviesService.getShowtimes(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.moviesService.update(id, dto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
