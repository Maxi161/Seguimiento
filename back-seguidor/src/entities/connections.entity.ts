import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
}

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  // Usuario que inicia la conexión
  @ManyToOne(() => User, (user) => user.sentConnections, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'userAId' })
  userA: User;

  // Usuario que recibe la conexión
  @ManyToOne(() => User, (user) => user.receivedConnections, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'userBId' })
  userB: User;

  // Estado de la conexión (pendiente, aceptada, bloqueada, etc.)
  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.PENDING,
  })
  status: ConnectionStatus;

  // Opcional: Puedes añadir campos como fecha de conexión, notas, etc.
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
