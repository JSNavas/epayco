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
    const result = await this.walletService.recargar(recargaDto);
    return {
      status: result.success ? 'success' : 'error',
      code: result.success ? 200 : 400,
      message: result.message,
      data: result.data,
    };
  }

  @Post('pagar')
  async pagar(@Body() pagoDto: PagoDto) {
    const result = await this.walletService.pagar(pagoDto);
    return {
      status: result.success ? 'success' : 'error',
      code: result.success ? 200 : 400,
      message: result.message,
      data: result.data,
    };
  }

  @Post('confirmar-pago')
  async confirmarPago(@Body() confirmarPagoDto: ConfirmarPagoDto) {
    const result = await this.walletService.confirmarPago(confirmarPagoDto);
    return {
      status: result.success ? 'success' : 'error',
      code: result.success ? 200 : 400,
      message: result.message,
      data: result.data,
    };
  }

  @Post('consulta-saldo')
  async consultarSaldo(@Body() consultaSaldoDto: ConsultaSaldoDto) {
    const result = await this.walletService.consultarSaldo(consultaSaldoDto);
    return {
      status: result.success ? 'success' : 'error',
      code: result.success ? 200 : 400,
      message: result.message,
      data: result.data,
    };
  }
}
