import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.BACKEND_DB_URL || 'http://localhost:3001',
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
