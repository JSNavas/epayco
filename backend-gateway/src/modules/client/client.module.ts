import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.BACKEND_DB_URL || 'http://localhost:3001',
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
