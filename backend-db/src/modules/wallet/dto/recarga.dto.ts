import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RecargaDto {
  @IsString()
  @IsNotEmpty()
  readonly documento: string;

  @IsString()
  @IsNotEmpty()
  readonly celular: string;

  @IsNotEmpty()
  @IsNumber()
  readonly valor: number;
}