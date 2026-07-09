import { IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  bookingId!: string;

  @IsOptional()
  @IsString()
  qrCode?: string;
}
