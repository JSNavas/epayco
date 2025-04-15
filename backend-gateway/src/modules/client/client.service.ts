import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientService {
  constructor(private readonly httpService: HttpService) {}

  async registerClient(payload: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/client/register', payload)
      );
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        code: 400,
        message: 'Hubo un error al registrar el cliente',
        data: error.response?.data || error.message,
      };
    }
  }
}
