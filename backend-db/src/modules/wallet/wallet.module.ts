import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Client } from '../client/entities/client.entity';
import { EmailModule } from '../../common/email/email.module';
import { SessionToken } from './entities/session-token.entity';
import { ResponseModule } from '../../common/response/response.module';
import { Transaction } from './entities/transaction.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Client, SessionToken, Transaction]), EmailModule, ResponseModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
