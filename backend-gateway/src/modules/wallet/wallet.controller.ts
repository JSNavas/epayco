import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('recharge')
  async recharge(@Body() payload: any) {
    return this.walletService.recharge(payload);
  }

  @Post('pay')
  async pay(@Body() payload: any) {
    return this.walletService.pay(payload);
  }

  @Post('confirm-payment')
  async confirmPayment(@Body() payload: any) {
    return this.walletService.confirmPayment(payload);
  }

  @Post('total-balance')
  async totalBalance(@Body() payload: any) {
    return this.walletService.totalBalance(payload);
  }

  @Post('transactions')
  async transactions(@Body() payload: any) {
    return await this.walletService.transactions(payload);
  }
}
