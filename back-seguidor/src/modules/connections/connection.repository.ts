// connection.repository.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Connection, ConnectionStatus } from 'src/entities/connections.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ConnectionRepository {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepo: Repository<Connection>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Encontrar conexiones de un usuario específico, sin importar si es userA o userB
  async findConnectionsByUserId(userId: string): Promise<Connection[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    return await this.connectionRepo
      .createQueryBuilder('connection')
      .where('connection.userAId = :userId OR connection.userBId = :userId', {
        userId,
      })
      .getMany();
  }

  // Encontrar solicitudes de conexión pendientes para un usuario específico
  async findPendingConnections(userId: string): Promise<Connection[]> {
    return this.connectionRepo
      .createQueryBuilder('connection')
      .where('connection.userBId = :userId', { userId })
      .andWhere('connection.status = :status', {
        status: ConnectionStatus.PENDING,
      })
      .getMany();
  }

  // Crear una nueva conexión entre dos usuarios
  async createConnection(
    userAId: string,
    userBId: string,
  ): Promise<Connection> {
    const userA = await this.userRepo.findOne({ where: { id: userAId } });
    const userB = await this.userRepo.findOne({ where: { id: userBId } });

    if (!userA || !userB) {
      throw new Error('One or both users not found.');
    }

    const newConnection = this.connectionRepo.create({
      userA,
      userB,
      status: ConnectionStatus.PENDING,
    });

    return await this.connectionRepo.save(newConnection);
  }

  // Actualizar el estado de una conexión existente
  async updateConnectionStatus(
    connectionId: string,
    status: ConnectionStatus,
  ): Promise<Connection> {
    const connection = await this.connectionRepo.findOne({
      where: { id: connectionId },
    });
    if (!connection) {
      throw new Error(`Connection with ID ${connectionId} not found.`);
    }

    connection.status = status;
    return await this.connectionRepo.save(connection);
  }
}
