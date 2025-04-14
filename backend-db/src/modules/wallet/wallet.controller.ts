import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { RecargaDto } from './dto/recarga.dto';
import { PagoDto } from './dto/pago.dto';
import { ConfirmarPagoDto } from './dto/confirmar-pago.dto';
import { ConsultaSaldoDto } from './dto/consulta-saldo.dto';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('recarga-billetera')
  async recargar(@Body() recargaDto: RecargaDto) {
    return await this.walletService.recargar(recargaDto);
  }

  @Post('pagar')
  async pagar(@Body() pagoDto: PagoDto) {
    return await this.walletService.pagar(pagoDto);
  }

  @Post('confirmar-pago')
  async confirmarPago(@Body() confirmarPagoDto: ConfirmarPagoDto) {
    return await this.walletService.confirmarPago(confirmarPagoDto);
  }

  @Post('consulta-saldo')
  async consultarSaldo(@Body() consultaSaldoDto: ConsultaSaldoDto) {
    return await this.walletService.consultarSaldo(consultaSaldoDto);
  }
}
