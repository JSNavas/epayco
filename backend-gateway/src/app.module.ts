import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ClientModule } from './modules/client/client.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      baseURL: process.env.BACKEND_DB_URL || 'http://localhost:3001',
      timeout: 5000,
      maxRedirects: 5,
    }),
    ClientModule,
    WalletModule,
  ],
})
export class AppModule {}
