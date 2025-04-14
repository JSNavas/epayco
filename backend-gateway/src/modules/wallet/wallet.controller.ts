import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('recarga-billetera')
  async recargar(@Body() payload: any) {
    return this.walletService.recargar(payload);
  }

  @Post('pagar')
  async pagar(@Body() payload: any) {
    return this.walletService.pagar(payload);
  }

  @Post('confirmar-pago')
  async confirmarPago(@Body() payload: any) {
    return this.walletService.confirmarPago(payload);
  }

  @Post('consulta-saldo')
  async consultarSaldo(@Body() payload: any) {
    return this.walletService.consultarSaldo(payload);
  }
}
