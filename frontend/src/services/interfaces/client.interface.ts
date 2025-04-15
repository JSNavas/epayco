export interface ClientData {
  documento?: string;
  celular?: string;
  email?: string;
  nombres?: string;
  saldo?: number;
}

export interface RegisterRequest {
  documento: string;
  nombres: string;
  email: string;
  celular: string;
}
