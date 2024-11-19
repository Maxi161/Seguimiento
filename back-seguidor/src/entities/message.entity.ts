import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  content: string;

  @CreateDateColumn()
  sentAt: Date;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'senderId' })
  sender: User | Partial<User>;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'receiverId' })
  receiver: User | Partial<User>;
}
