import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('cinemas')
export class CinemasController {
  constructor(private cinemasService: CinemasService) {}

  // Public
  @Get()
  findAll() {
    return this.cinemasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateCinemaDto) {
    return this.cinemasService.create(dto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCinemaDto) {
    return this.cinemasService.update(id, dto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(id);
  }
}
