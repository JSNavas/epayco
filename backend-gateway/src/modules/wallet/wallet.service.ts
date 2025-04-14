import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WalletService {
  constructor(private readonly httpService: HttpService) {}

  async recargar(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/recarga-billetera', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error en recarga-billetera',
        data: error.response?.data || error.message,
      };
    }
  }

  async pagar(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/pagar', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error en pagar',
        data: error.response?.data || error.message,
      };
    }
  }

  async confirmarPago(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/confirmar-pago', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error en confirmar-pago',
        data: error.response?.data || error.message,
      };
    }
  }

  async consultarSaldo(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/consulta-saldo', payload)
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
