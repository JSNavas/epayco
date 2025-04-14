import { Injectable } from '@nestjs/common';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async registrarCliente(createClienteDto: CreateClientDto): Promise<Client | null> {
    const clientExists = await this.clientRepository.findOne({
      where: [{ documento: createClienteDto.documento }, { email: createClienteDto.email }],
    });

    if (clientExists) {
      return null;
    }

    const client = this.clientRepository.create(createClienteDto);
    return await this.clientRepository.save(client);
  }
}
