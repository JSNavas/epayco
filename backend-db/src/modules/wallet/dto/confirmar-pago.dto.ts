import { IsNotEmpty, Matches, IsUUID } from 'class-validator';

export class ConfirmarPagoDto {
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;

  @IsNotEmpty()
  @Matches(/^[a-fA-F0-9]{6}$/, { message: 'El token debe contener 6 caracteres' })
  token: string;
}
