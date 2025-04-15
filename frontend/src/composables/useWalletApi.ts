import { api } from 'src/services/api';
import { PaymentRequest, ConfirmPaymentResponse } from 'src/services/interfaces/payment.interface';
import { RechargeRequest } from 'src/services/interfaces/recharge.interface'
import { TotalBalanceRequest } from 'src/services/interfaces/totalBalance.interface';
import { RegisterRequest } from 'src/services/interfaces/client.interface';
import { ApiResponse,  ApiMethod, ApiError } from 'src/services/interfaces/api.interface';
import { TransactionRequest } from 'src/services/interfaces/transaction.interface';

// API Composables
export function useWalletApi() {
  const registerClient: ApiMethod<RegisterRequest> = async (payload) => {
    try {
      const response = await api.post<ApiResponse>('/client/register', payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as ApiError;
      return { status: 'error', code: axiosError.response?.status || 500, message: axiosError.message, data: null };
    }
  };

  const recharge: ApiMethod<RechargeRequest> = async (payload) => {
    try {
      const response = await api.post<ApiResponse>('/wallet/recharge', payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as ApiError;
      return { status: 'error', code: axiosError.response?.status || 500, message: axiosError.message, data: null };
    }
  };

  const pay: ApiMethod<PaymentRequest> = async (payload) => {
    try {
      const response = await api.post<ApiResponse>('/wallet/pay', payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as ApiError;
      return { status: 'error', code: axiosError.response?.status || 500, message: axiosError.message, data: null };
    }
  };

  const confirmPayment: ApiMethod<ConfirmPaymentResponse> = async (payload) => {
    try {
      const response = await api.post<ApiResponse>('/wallet/confirm-payment', payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as ApiError;
      return { status: 'error', code: axiosError.response?.status || 500, message: axiosError.message, data: null };
    }
  };

  const totalBalance: ApiMethod<TotalBalanceRequest> = async (payload) => {
    try {
      const response = await api.post<ApiResponse>('/wallet/total-balance', payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as ApiError;
      return { status: 'error', code: axiosError.response?.status || 500, message: axiosError.message, data: null };
    }
  };

  const transactions: ApiMethod<TransactionRequest> = async (payload) => {
    try {
      const response = await api.post<ApiResponse>('/wallet/transactions', payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as ApiError;
      return { status: 'error', code: axiosError.response?.status || 500, message: axiosError.message, data: null };
    }
  };

  return {
    registerClient,
    recharge,
    pay,
    confirmPayment,
    totalBalance,
    transactions,
  };
}
