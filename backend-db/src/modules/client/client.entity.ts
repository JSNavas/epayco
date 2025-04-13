import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clientes' })
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  documento: string;

  @Column()
  nombres: string;

  @Column({ unique: true })
  email: string;

  @Column()
  celular: string;

  @Column({ type: 'decimal', default: 0 })
  saldo: number;
}
