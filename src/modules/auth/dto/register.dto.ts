import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;
}
