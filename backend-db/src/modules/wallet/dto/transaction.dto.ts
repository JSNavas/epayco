import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  readonly documento: string;

  @IsString()
  @IsNotEmpty()
  readonly celular: string;
}