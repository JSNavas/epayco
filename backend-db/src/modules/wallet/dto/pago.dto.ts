import { IsNotEmpty, IsNumber } from 'class-validator';

export class PagoDto {
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
  celular: string;

  @IsNotEmpty()
  @IsNumber()
  valor: number;
}
