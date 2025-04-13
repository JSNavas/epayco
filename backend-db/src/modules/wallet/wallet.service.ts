import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../client/client.entity';
import { RecargaDto } from './dto/recarga.dto';
import { PagoDto } from './dto/pago.dto';
import { ConfirmarPagoDto } from './dto/confirmar-pago.dto';
import { ConsultaSaldoDto } from './dto/consulta-saldo.dto';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
  private tokens: Map<string, { token: string; valor: number; clientId: number }> = new Map();

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async recargar(recargaDto: RecargaDto): Promise<any> {
    const { documento, celular, valor } = recargaDto;
    const client = await this.clientRepository.findOne({ where: { documento, celular } });
    if (!client) {
      return { success: false, message: 'Cliente no encontrado', data: null };
    }

    client.saldo = Number(client.saldo) + Number(valor);
    await this.clientRepository.save(client);
    return { success: true, message: 'Billetera recargada exitosamente', data: { saldo: client.saldo } };
  }

  async pagar(pagoDto: PagoDto): Promise<any> {
    const { documento, celular, valor } = pagoDto;
    const client = await this.clientRepository.findOne({ where: { documento, celular } });
    if (!client) {
      return { success: false, message: 'Cliente no encontrado', data: null };
    }

    if (Number(client.saldo) < Number(valor)) {
      return { success: false, message: 'Saldo insuficiente', data: null };
    }

    // Generar token de 6 dígitos y un identificador de sesión único
    const token = String(Math.floor(100000 + Math.random() * 900000));
    const sessionId = uuidv4();

    // Guardar token para confirmar el pago
    this.tokens.set(sessionId, { token, valor: Number(valor), clientId: client.id });

    // Configuracion de nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
      from: '"Billetera Virtual" <epayco@example.com>',
      to: client.email,
      subject: 'Token de Confirmación de Pago',
      text: `Tu token de confirmación es: ${token}`,
    };

    // Enviar el correo con el token
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error enviando correo:', error);
      } else {
        console.log('Correo enviado:', info.response);
      }
    });

    return {
      success: true,
      message: 'Token enviado al correo, confirma el pago con el sessionId y token',
      data: { sessionId },
    };
  }

  async confirmarPago(confirmarPagoDto: ConfirmarPagoDto): Promise<any> {
    const { sessionId, token } = confirmarPagoDto;
    const record = this.tokens.get(sessionId);
    if (!record) {
      return { success: false, message: 'Session inválida o expirada', data: null };
    }

    if (record.token !== token) {
      return { success: false, message: 'Token inválido', data: null };
    }

    // Obtener el cliente y consultar el saldo
    const client = await this.clientRepository.findOne({ where: { id: record.clientId } });
    if (!client) {
      return { success: false, message: 'Cliente no encontrado', data: null };
    }

    if (Number(client.saldo) < record.valor) {
      return { success: false, message: 'Saldo insuficiente', data: null };
    }

    client.saldo = Number(client.saldo) - record.valor;
    await this.clientRepository.save(client);

    // El token se elimina una vez confirmado el pago
    this.tokens.delete(sessionId);

    return {
      success: true,
      message: 'Pago confirmado y saldo descontado',
      data: { saldo: client.saldo },
    };
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
