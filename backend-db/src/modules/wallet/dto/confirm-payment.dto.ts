import { IsNotEmpty, Matches, IsUUID } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;

  @IsNotEmpty()
  @Matches(/^[a-fA-F0-9]{6}$/, { message: 'El token debe contener 6 caracteres' })
  token: string;
}
