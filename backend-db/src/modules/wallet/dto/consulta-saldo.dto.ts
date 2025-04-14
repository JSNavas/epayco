import { IsNotEmpty, IsString } from 'class-validator';

export class ConsultaSaldoDto {
  @IsString()
  @IsNotEmpty()
  readonly documento: string;

  @IsString()
  @IsNotEmpty()
  readonly celular: string;
}
