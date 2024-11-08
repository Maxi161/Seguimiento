import { Controller } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './message.dto';
import { MessageService } from './messages.service';

@WebSocketGateway({
  namespace: 'message',
  cors: {
    origin: '*', // O tu URL de producción
    credentials: true,
  },
})
@Controller('message')
export class MessageController {
  constructor(private readonly messService: MessageService) {}

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join-chat')
  handleJoinChat(client: Socket, userId: string) {
    this.connectedUsers.set(userId, client.id);
    client.join(userId);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(client: Socket, data: SendMessageDto) {
    const { sender, receiver, content } = data;

    // Guardar el mensaje en la base de datos
    await this.messService.saveMessage(receiver, content, sender);

    const receiverSocketId = this.connectedUsers.get(receiver);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive-message', {
        sender,
        content,
        receiver,
      });
    } else {
      console.log(`User ${receiver} not connected`);
    }
  }
}
