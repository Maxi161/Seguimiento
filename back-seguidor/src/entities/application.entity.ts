import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  status: string;

  @Column()
  position: string;

  @Column()
  actions: string;

  @Column()
  comments: string;

  @Column({ type: 'date', nullable: true, default: new Date() })
  applicationDate: Date;

  // Contact fields
  @Column()
  recruiterName: string;

  @Column()
  company: string;

  @Column()
  companyContact: string;

  @Column()
  industry: string;

  @Column()
  applicationLink: string;

  @Column()
  platform: string;

  @Column({ type: 'date', nullable: true })
  phoneScreen: Date;

  @Column({ type: 'date', nullable: true })
  firstInterview: Date;

  @Column({ type: 'date', nullable: true })
  secondInterview: Date;

  @Column({ type: 'date', nullable: true })
  thirdInterview: Date;

  @Column({ type: 'date', nullable: true })
  extraInterview: Date;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn()
  user: User;
}
