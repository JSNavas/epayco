import { IsNotEmpty, IsString } from 'class-validator';

export class TotalBalanceDto {
  @IsString()
  @IsNotEmpty()
  readonly documento: string;

  @IsString()
  @IsNotEmpty()
  readonly celular: string;
}
