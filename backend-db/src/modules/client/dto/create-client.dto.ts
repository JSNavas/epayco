import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
  nombres: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  celular: string;
}
