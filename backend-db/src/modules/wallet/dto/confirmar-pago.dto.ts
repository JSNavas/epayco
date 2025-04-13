import { IsNotEmpty, Matches } from 'class-validator';

export class ConfirmarPagoDto {
  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'El token debe contener 6 dígitos' })
  token: string;
}
