import { IsNotEmpty } from 'class-validator';

export class ConsultaSaldoDto {
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
  celular: string;
}
