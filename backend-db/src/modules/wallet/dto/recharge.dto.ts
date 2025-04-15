import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class RechargeDto {
  @IsString()
  @IsNotEmpty()
  readonly documento: string;

  @IsString()
  @IsNotEmpty()
  readonly celular: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly valor: number;
}