import { IsNumber, Min } from 'class-validator';

export class UpdateServicePriceDto {
  @IsNumber()
  @Min(0, { message: 'Стоимость не может быть отрицательной' })
  price: number;
}
