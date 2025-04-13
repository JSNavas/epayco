import { IsNotEmpty, IsNumber } from 'class-validator';

export class RecargaDto {
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
  celular: string;

  @IsNotEmpty()
  @IsNumber()
  valor: number;
}
