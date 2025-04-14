import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [HttpModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
