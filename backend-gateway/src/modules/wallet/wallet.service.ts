import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WalletService {
  constructor(private readonly httpService: HttpService) {}

  async recharge(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/wallet/recharge', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error al recargar la billetera',
        data: error.response?.data || error.message,
      };
    }
  }

  async pay(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/wallet/pay', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error al realizar el pago',
        data: error.response?.data || error.message,
      };
    }
  }

  async confirmPayment(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/wallet/confirm-payment', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error al confirmar el pago',
        data: error.response?.data || error.message,
      };
    }
  }

  async totalBalance(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/wallet/total-balance', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error en consulta-saldo',
        data: error.response?.data || error.message,
      };
    }
  }
}
