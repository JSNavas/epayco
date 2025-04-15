export type TransactionType = 'recharge' | 'payment';

export interface TransactionRequest {
  documento: string;
  celular: string;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: string;
  date?: string;
}
