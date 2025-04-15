export interface PaymentRequest {
  documento: string;
  celular: string;
  valor: number;
}

export interface ConfirmPaymentResponse {
  sessionId: string;
  token: string;
}
