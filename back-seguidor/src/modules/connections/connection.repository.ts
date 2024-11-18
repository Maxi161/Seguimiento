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
  async findConnectionsByUserId(
    userId: string,
  ): Promise<Partial<Connection>[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Modificamos la consulta para obtener los detalles de userA y userB
    const connections = await this.connectionRepo
      .createQueryBuilder('connection')
      .select([
        'connection.id',
        'connection.status',
        'connection.createdAt',
        'userA.id',
        'userA.name',
        'userA.role',
        'userA.email',
        'userB.id',
        'userB.name',
        'userB.role',
        'userB.email',
      ])
      .leftJoin('connection.userA', 'userA')
      .leftJoin('connection.userB', 'userB')
      .where('connection.userAId = :userId OR connection.userBId = :userId', {
        userId,
      })
      .getMany();

    // Mapeamos para devolver los detalles de userA y userB
    return connections.map((connection) => ({
      id: connection.id,
      status: connection.status,
      createdAt: connection.createdAt,
      userA: {
        id: connection.userA.id,
        name: connection.userA.name,
        role: connection.userA.role,
        email: connection.userA.email,
      },
      userB: {
        id: connection.userB.id,
        name: connection.userB.name,
        role: connection.userB.role,
        email: connection.userB.email,
      },
    }));
  }

  // Encontrar solicitudes de conexión pendientes para un usuario específico
  async findPendingConnections(userId: string): Promise<Partial<Connection>[]> {
    const connections = await this.connectionRepo
      .createQueryBuilder('connection')
      .select([
        'connection.id',
        'connection.status',
        'connection.createdAt',
        'userA.id',
        'userA.name',
        'userA.role',
        'userA.email',
        'userB.id',
        'userB.name',
        'userB.role',
        'userB.email',
      ])
      .leftJoin('connection.userA', 'userA')
      .leftJoin('connection.userB', 'userB')
      .where('connection.userBId = :userId', { userId })
      .andWhere('connection.status = :status', {
        status: ConnectionStatus.PENDING,
      })
      .getMany();

    // Mapeamos para devolver los detalles de userA y userB
    return connections.map((connection) => ({
      id: connection.id,
      status: connection.status,
      createdAt: connection.createdAt,
      userA: {
        id: connection.userA.id,
        name: connection.userA.name,
        role: connection.userA.role,
        email: connection.userA.email,
      },
      userB: {
        id: connection.userB.id,
        name: connection.userB.name,
        role: connection.userB.role,
        email: connection.userB.email,
      },
    }));
  }

  // Crear una nueva conexión entre dos usuarios
  async createConnection(
    userAId: string,
    userBId: string,
  ): Promise<Partial<Connection>> {
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

    const savedConnection = await this.connectionRepo.save(newConnection);

    // Retornamos los detalles completos de userA y userB
    return {
      id: savedConnection.id,
      status: savedConnection.status,
      createdAt: savedConnection.createdAt,
      userA: {
        id: savedConnection.userA.id,
        name: savedConnection.userA.name,
        role: savedConnection.userA.role,
        email: savedConnection.userA.email,
      },
      userB: {
        id: savedConnection.userB.id,
        name: savedConnection.userB.name,
        role: savedConnection.userB.role,
        email: savedConnection.userB.email,
      },
    };
  }

  // Actualizar el estado de una conexión existente
  async updateConnectionStatus(
    connectionId: string,
    status: ConnectionStatus,
  ): Promise<Partial<Connection>> {
    const connection = await this.connectionRepo.findOne({
      where: { id: connectionId },
    });
    if (!connection) {
      throw new Error(`Connection with ID ${connectionId} not found.`);
    }

    connection.status = status;
    const updatedConnection = await this.connectionRepo.save(connection);

    // Retornamos los detalles completos de userA y userB
    return {
      id: updatedConnection.id,
      status: updatedConnection.status,
      createdAt: updatedConnection.createdAt,
      userA: {
        id: updatedConnection.userA.id,
        name: updatedConnection.userA.name,
        role: updatedConnection.userA.role,
        email: updatedConnection.userA.email,
      },
      userB: {
        id: updatedConnection.userB.id,
        name: updatedConnection.userB.name,
        role: updatedConnection.userB.role,
        email: updatedConnection.userB.email,
      },
    };
  }
}
