import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { v4 as uuid } from 'uuid';
import { Message } from './message.entity';
import { Connection } from './connections.entity';

export enum UserRole {
  STUDENT = 'student',
  COACH = 'coach',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @OneToMany(() => Application, (application) => application.user, {
    cascade: true,
    eager: true,
  })
  applications: Application[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Connection, (connection) => connection.userA)
  sentConnections: Connection[];

  // Conexiones recibidas por este usuario
  @OneToMany(() => Connection, (connection) => connection.userB)
  receivedConnections: Connection[];
}
