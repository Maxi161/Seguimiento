import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { v4 as uuid } from 'uuid';
import { Message } from './message.entity';
import { Connection } from './connections.entity';
import { Role } from 'src/helpers/roles.enum';

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

  @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
  role: Role;

  @OneToMany(() => Application, (application) => application.user, {
    cascade: true,
  })
  applications: Application[];

  @OneToMany(() => Message, (message) => message.sender, {
    cascade: true,
  })
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver, {
    cascade: true,
  })
  receivedMessages: Message[];

  @OneToMany(() => Connection, (connection) => connection.userA)
  sentConnections: Connection[];

  @OneToMany(() => Connection, (connection) => connection.userB)
  receivedConnections: Connection[];
}
