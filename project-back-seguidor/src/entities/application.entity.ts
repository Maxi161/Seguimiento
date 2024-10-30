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

  @Column({ type: 'date' })
  applicationDate: Date;

  // Contact fields
  @Column()
  recruiterName: string;

  @Column()
  companyContact: string;

  @Column()
  industry: string;

  @Column()
  applicationLink: string;

  // Interview fields
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
