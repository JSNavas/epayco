import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientService {
  constructor(private readonly httpService: HttpService) {}

  async registrarCliente(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/registro-cliente', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Error en registro-cliente',
        data: error.response?.data || error.message,
      };
    }
  }
}
