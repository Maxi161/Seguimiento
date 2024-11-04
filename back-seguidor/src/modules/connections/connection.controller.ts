// connection.controller.ts
import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { Connection } from 'src/entities/connections.entity';

@Controller('connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('request')
  async sendConnectionRequest(
    @Body('userAId') userAId: string,
    @Body('userBId') userBId: string,
  ): Promise<Connection> {
    return this.connectionService.sendConnectionRequest(userAId, userBId);
  }

  @Patch(':id/accept')
  async acceptConnectionRequest(
    @Param('id') connectionId: string,
  ): Promise<Connection> {
    return this.connectionService.acceptConnectionRequest(connectionId);
  }

  @Patch(':id/block')
  async blockConnection(
    @Param('id') connectionId: string,
  ): Promise<Connection> {
    return this.connectionService.blockConnection(connectionId);
  }

  @Get(':userId')
  async getUserConnections(
    @Param('userId') userId: string,
  ): Promise<Connection[]> {
    return this.connectionService.getUserConnections(userId);
  }

  @Get(':userId/pending')
  async getPendingConnections(
    @Param('userId') userId: string,
  ): Promise<Connection[]> {
    return this.connectionService.getPendingConnections(userId);
  }
}
