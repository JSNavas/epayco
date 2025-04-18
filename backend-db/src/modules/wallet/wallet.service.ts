import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Client } from '../client/entities/client.entity';
import { SessionToken } from './entities/session-token.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { RechargeDto } from './dto/recharge.dto';
import { PaymentDto } from './dto/payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { TotalBalanceDto } from './dto/total-balance.dto';
import { TransactionDto } from './dto/transaction.dto';
import { EmailService } from '../../common/email/email.service';
import { ResponseService } from '../../common/response/response.service';
import * as crypto from 'crypto';
@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private readonly tokenExpirationTime = 15 * 60 * 1000; // 15 minutos de expiración para el token

  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(SessionToken) private sessionTokenRepository: Repository<SessionToken>,
    private dataSource: DataSource,
    private emailService: EmailService,
    private responseService: ResponseService,
  ) {}

  // Método de recarga con transacción y bloqueo pesimista
  async recharge(recharge: RechargeDto): Promise<any> {
    const { documento, celular, valor } = recharge;

    try {
      return await this.dataSource.transaction(async manager => {
        const client = await this.findClientWithLock(manager, { documento, celular });

        if (!client) return this.responseService.buildErrorResponse('Cliente no encontrado');

        client.saldo = Number(client.saldo) + Number(valor);
        await manager.save(client);

        // Registra la transacción
        const history = manager.create(Transaction, {
          clientId: client.id,
          type: TransactionType.RECHARGE,
          amount: valor,
          description: 'Recarga',
        });
        await manager.save(history);

        return this.responseService.buildSuccessResponse('Billetera recargada exitosamente', client);
      });
    } catch (error) {
      this.logger.error('Error en recarga-billetera', error);
      return this.responseService.buildErrorResponse('Error en recarga-billetera', error.message);
    }
  }

  // Método para iniciar el pago
  async pay(payment: PaymentDto): Promise<any> {
    const { documento, celular, valor } = payment;

    try {
      const client = await this.clientRepository.findOne({ where: { documento, celular } });
      if (!client) return this.responseService.buildErrorResponse('Cliente no encontrado');
      if (client.saldo < Number(valor)) return this.responseService.buildErrorResponse('Saldo insuficiente');

      const token = this.generateToken();
      const sessionToken = this.sessionTokenRepository.create({ token, valor: Number(valor), clientId: client.id });
      await this.sessionTokenRepository.save(sessionToken);
      
      // Envia el token por correo electrónico
      return await this.sendTokenByEmail(client, token, sessionToken.id);
    } catch (error) {
      this.logger.error('Error en proceso de pago', error);
      return this.responseService.buildErrorResponse('Error en proceso de pago', error.message);
    }
  }

  // Método para confirmar el pago y descontar el saldo, gestionado en transacción
  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto): Promise<any> {
    const { sessionId, token } = confirmPaymentDto;

    try {
      return await this.dataSource.transaction(async manager => {
        const sessionToken = await manager.findOne(SessionToken, { where: { id: sessionId } });
        if (!sessionToken) return this.responseService.buildErrorResponse('Session inválida o expirada');
        if (sessionToken.token !== token || this.isTokenExpired(sessionToken.createdAt)) {
          return this.responseService.buildErrorResponse('Token inválido o expirado');
        }

        const client = await this.findClientWithLock(manager, { id: sessionToken.clientId });
        
        if (!client) return this.responseService.buildErrorResponse('Cliente no encontrado');
        if (Number(client.saldo) < sessionToken.valor) return this.responseService.buildErrorResponse('Saldo insuficiente');

        client.saldo -= sessionToken.valor;
        await manager.save(client);
        
        // Registra la transacción
        const history = manager.create(Transaction, {
          clientId: client.id,
          type: TransactionType.PAYMENT,
          amount: sessionToken.valor,
          description: 'Compra',
        });
        await manager.save(history);

        // Elimina el token de sesión despues de usarlo
        await manager.delete(SessionToken, { id: sessionToken.id });

        return this.responseService.buildSuccessResponse('Su pago ha sido confirmado', client);
      });
    } catch (error) {
      this.logger.error('Error en confirmar-pago', error);
      return this.responseService.buildErrorResponse('Error en confirmar-pago', error.message);
    }
  }

  // Método para consultar el saldo del cliente
  async totalBalance(totalBalance: TotalBalanceDto): Promise<any> {
    const { documento, celular } = totalBalance;

    try {
      const client = await this.clientRepository.findOne({ where: { documento, celular } });
      if (!client) return this.responseService.buildErrorResponse('Cliente no encontrado');

      return this.responseService.buildSuccessResponse('Consulta exitosa', {...client, saldo: Number(client.saldo)});
    } catch (error) {
      this.logger.error('Error consultando saldo', error);
      return this.responseService.buildErrorResponse('Error consultando saldo', error.message);
    }
  }

  // Método para consultar el historial de transacciones
  async transactions(transactionDto: TransactionDto): Promise<any> {
    const { documento, celular } = transactionDto;

    try {
      const client = await this.clientRepository.findOne({ where: { documento, celular } });
      if (!client) return this.responseService.buildErrorResponse('Cliente no encontrado');

      const transactions = await this.dataSource.getRepository(Transaction).find({
        where: { clientId: client.id },
        order: { createdAt: 'DESC' }
      });
      
      return this.responseService.buildSuccessResponse('Transacciones consultadas exitosamente', transactions);
    } catch (error) {
      this.logger.error('Error al consultar las transacciones', error);
      return this.responseService.buildErrorResponse('Error al consultar las transacciones', error.message);
    }
  }

  private async findClientWithLock(manager: any, whereCondition: Partial<Client>): Promise<Client> {
    const client = await manager.findOne(Client, {
      where: whereCondition,
      lock: { mode: 'pessimistic_write' },
    });
    return client;
  }

  private generateToken(): string {
    return crypto.randomBytes(3).toString('hex');
  }

  private async sendTokenByEmail(client: Client, token: string, sessionId: string): Promise<any> {
    try {
      await this.emailService.sendMail(client.email, 'Token de Confirmación de Pago', `Su token de confirmación es: ${token}`);
      return this.responseService.buildSuccessResponse('Confirma el pago con el token enviado a su correo', { sessionId });
    } catch (error) {
      this.logger.error('Error enviando token de confirmación', error);
      return this.responseService.buildErrorResponse('Error enviando token de confirmación');
    }
  }

  private isTokenExpired(createdAt: Date): boolean {
    return Date.now() - new Date(createdAt).getTime() > this.tokenExpirationTime;
  }
}
