export interface TotalBalanceRequest {
  documento: string;
  celular: string;
}

export interface TotalBalanceResponse {
  documento?: string;
  celular?: string;
  email?: string;
  nombres?: string;
  saldo?: number;
}
