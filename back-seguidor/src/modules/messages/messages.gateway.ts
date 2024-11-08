import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './message.dto';
import { MessageService } from './messages.service';

// @Controller('message')
@WebSocketGateway({
  namespace: 'message',
  cors: {
    origin: '*', // O tu URL de producción
    credentials: true,
  },
})
export class MessageGateway {
  constructor(private readonly messService: MessageService) {}

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join-chat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    this.connectedUsers.set(userId, client.id);
    client.join(userId);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
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
