import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Client } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
