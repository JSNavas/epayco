import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Client } from '../client/entities/client.entity';
import { EmailModule } from '../email/email.module';
import { SessionToken } from './entities/session-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, SessionToken]), EmailModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
