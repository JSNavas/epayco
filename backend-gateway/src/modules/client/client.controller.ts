import { Controller, Post, Body } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('registro-cliente')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async registroCliente(@Body() payload: any) {
    return this.clientService.registrarCliente(payload);
  }
}
