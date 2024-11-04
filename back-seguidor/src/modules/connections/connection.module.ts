// connection.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { ConnectionRepository } from './connection.repository';
import { Connection } from 'src/entities/connections.entity';
import { UserModule } from '../users/users.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, User]), UserModule],
  controllers: [ConnectionController],
  providers: [ConnectionService, ConnectionRepository],
  exports: [ConnectionService],
})
export class ConnectionModule {}
