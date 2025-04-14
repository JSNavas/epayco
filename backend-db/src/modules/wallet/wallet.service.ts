import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Client } from '../client/entities/client.entity';
import { RecargaDto } from './dto/recarga.dto';
import { PagoDto } from './dto/pago.dto';
import { ConfirmarPagoDto } from './dto/confirmar-pago.dto';
import { ConsultaSaldoDto } from './dto/consulta-saldo.dto';
import { EmailService } from '../email/email.service';
import { SessionToken } from './entities/session-token.entity';
import * as crypto from 'crypto';

@Injectable()
export class WalletService {
  private readonly tokenExpirationTime = 15 * 60 * 1000; // 15 minutos de expiración para el token

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(SessionToken)
    private sessionTokenRepository: Repository<SessionToken>,
    private dataSource: DataSource,
    private emailService: EmailService,
  ) {}

  // Método de recarga con transacción y bloqueo pesimista
  async recargar(recargaDto: RecargaDto): Promise<any> {
    const { documento, celular, valor } = recargaDto;
    try {
      const result = await this.dataSource.transaction(async transactionalEntityManager => {
        // Buscar el cliente con lock para evitar condiciones de carrera
        const client = await transactionalEntityManager.findOne(Client, {
          where: { documento, celular },
          lock: { mode: 'pessimistic_write' },
        });
        if (!client) {
          throw new BadRequestException('Cliente no encontrado');
        }
        // Actualizar el saldo de forma atómica
        client.saldo = Number(client.saldo) + Number(valor);
        await transactionalEntityManager.save(client);
        return {
          success: true,
          message: 'Billetera recargada exitosamente',
          data: { saldo: client.saldo },
        };
      });
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Error en recarga-billetera',
        data: error instanceof Error ? error.message : error,
      };
    }
  }

  // Método para iniciar el pago: genera token y guarda datos temporalmente
  async pagar(pagoDto: PagoDto): Promise<any> {
    const { documento, celular, valor } = pagoDto;
    const client = await this.clientRepository.findOne({ where: { documento, celular } });
    if (!client) {
      return { success: false, message: 'Cliente no encontrado', data: null };
    }
    if (Number(client.saldo) < Number(valor)) {
      return { success: false, message: 'Saldo insuficiente', data: null };
    }
    // Generar token de 6 dígitos y crear un identificador de sesión único
    const token = crypto.randomBytes(3).toString('hex'); // Genera un token más seguro
    const sessionToken = this.sessionTokenRepository.create({ token, valor: Number(valor), clientId: client.id });
    await this.sessionTokenRepository.save(sessionToken);

    try {
      // Enviar el token al correo del cliente
      await this.emailService.sendMail(client.email, 'Token de Confirmación de Pago', `Tu token de confirmación es: ${token}`);

      return {
        success: true,
        message: 'Token enviado al correo, confirma el pago con el sessionId y token',
        data: { sessionId: sessionToken.id },
      };
    } catch (error) {
      console.error('Error enviando el token:', error);
      return { success: false, message: 'Error enviando token de confirmación', data: error };
    }
  }

  // Método para confirmar el pago y descontar el saldo, gestionado en transacción
  async confirmarPago(confirmarPagoDto: ConfirmarPagoDto): Promise<any> {
    const { sessionId, token } = confirmarPagoDto;
    const sessionToken = await this.sessionTokenRepository.findOne({ where: { id: sessionId } });

    if (!sessionToken || sessionToken.token !== token || Date.now() - new Date(sessionToken.createdAt).getTime() > this.tokenExpirationTime) {
      return { success: false, message: 'Token inválido o expirado', data: null };
    }

    try {
      // Busca y bloquea al cliente
      const result = await this.dataSource.transaction(async transactionalEntityManager => {
        const client = await transactionalEntityManager.findOne(Client, {
          where: { id: sessionToken.clientId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!client || Number(client.saldo) < sessionToken.valor) throw new BadRequestException('Cliente no encontrado o saldo insuficiente');

        client.saldo = Number(client.saldo) - sessionToken.valor;
        await transactionalEntityManager.save(client);
        await this.sessionTokenRepository.delete(sessionId);

        return { success: true, message: 'Pago confirmado y saldo descontado', data: { saldo: client.saldo } };
      });

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Error en confirmar-pago',
        data: error instanceof Error ? error.message : error,
      };
    }
  }

  async consultarSaldo(consultaSaldoDto: ConsultaSaldoDto): Promise<any> {
    const { documento, celular } = consultaSaldoDto;
    const client = await this.clientRepository.findOne({ where: { documento, celular } });
    if (!client) {
      return { success: false, message: 'Cliente no encontrado', data: null };
    }
    return { success: true, message: 'Consulta exitosa', data: { saldo: client.saldo } };
  }
}
