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

  @OneToMany(() => Message, (message) => message.sender, {
    cascade: true,
    eager: true,
  })
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver, {
    cascade: true,
    eager: true,
  })
  receivedMessages: Message[];

  @OneToMany(() => Connection, (connection) => connection.userA, {
    cascade: true,
    eager: true,
  })
  sentConnections: Connection[];

  @OneToMany(() => Connection, (connection) => connection.userB, {
    cascade: true,
    eager: true,
  })
  receivedConnections: Connection[];
}
