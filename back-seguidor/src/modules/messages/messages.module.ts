import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { MessageGateway } from './messages.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
