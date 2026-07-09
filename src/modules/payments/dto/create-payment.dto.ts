import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  bookingId!: string;

  @IsNumber()
  amount!: number;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}
