import { IsString } from 'class-validator';

export class CreateCinemaDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  city!: string;
}
