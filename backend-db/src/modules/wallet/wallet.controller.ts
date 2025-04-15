import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { RechargeDto } from './dto/recharge.dto';
import { PaymentDto } from './dto/payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { TotalBalanceDto } from './dto/total-balance.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('recharge')
  async recharge(@Body() recarga: RechargeDto) {
    return await this.walletService.recharge(recarga);
  }

  @Post('pay')
  async pay(@Body() payment: PaymentDto) {
    return await this.walletService.pay(payment);
  }

  @Post('confirm-payment')
  async confirmPayment(@Body() confirmPayment: ConfirmPaymentDto) {
    return await this.walletService.confirmPayment(confirmPayment);
  }

  @Post('total-balance')
  async totalBalance(@Body() totalBalance: TotalBalanceDto) {
    return await this.walletService.totalBalance(totalBalance);
  }
}
