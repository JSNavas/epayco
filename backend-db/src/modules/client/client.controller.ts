import { Controller, Post, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  async registroCliente(@Body() createClientDto: CreateClientDto) {
    const result = await this.clientService.registerClient(createClientDto);
    if (!result) {
      return {
        status: 'error',
        code: 400,
        message: 'Error al registrar el cliente, ya existe o los datos son inválidos',
        data: null,
      };
    }
    return {
      status: 'success',
      code: 200,
      message: 'Cliente registrado exitosamente',
      data: result,
    };
  }
}

