// connection.service.ts
import { Injectable } from '@nestjs/common';
import { ConnectionRepository } from './connection.repository';
import { Connection, ConnectionStatus } from 'src/entities/connections.entity';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly connectionRepository: ConnectionRepository,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async sendConnectionRequest(
    userA: string,
    userB: string,
  ): Promise<Connection> {
    return this.connectionRepository.createConnection(userA, userB);
  }

  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    return this.connectionRepository.updateConnectionStatus(
      connectionId,
      ConnectionStatus.ACCEPTED,
    );
  }

  async blockConnection(connectionID: string): Promise<Connection> {
    return this.connectionRepository.updateConnectionStatus(
      connectionID,
      ConnectionStatus.BLOCKED,
    );
  }

  async getUserConnections(userId: string): Promise<Connection[]> {
    return this.connectionRepository.findConnectionsByUserId(userId);
  }

  async getPendingConnections(userId: string): Promise<Connection[]> {
    return this.connectionRepository.findPendingConnections(userId);
  }
}
