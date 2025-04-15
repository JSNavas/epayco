import { Controller, Post, Body } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  async registerClient(@Body() payload: any) {
    return this.clientService.registerClient(payload);
  }
}
