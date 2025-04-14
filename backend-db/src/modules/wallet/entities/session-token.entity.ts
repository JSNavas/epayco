import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class SessionToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  valor: number;

  @Column()
  clientId: number;

  @CreateDateColumn()
  createdAt: Date;
}