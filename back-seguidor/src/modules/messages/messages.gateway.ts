import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationDto, SendMessageDto } from './message.dto';
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
    const sockets = [...this.connectedUsers.entries()];
    console.log(sockets);
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
    const previousSocketId = this.connectedUsers.get(userId);

    // Si el usuario ya estaba conectado, cierra la conexión previa
    if (previousSocketId) {
      const previousSocket =
        this.server?.sockets?.sockets?.get(previousSocketId);
      if (previousSocket) {
        previousSocket.disconnect();
      }
    }

    // Registra la nueva conexión
    console.log('Un cliente ha entrado al chat', userId, client.id);
    this.connectedUsers.set(userId, client.id);
    client.join(userId);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ) {
    const { sender, receiver, content } = data;

    // Guardar el mensaje en la base de datos
    const message = await this.messService.saveMessage(
      receiver,
      content,
      sender,
    );
    const receiverSocketId = this.connectedUsers.get(receiver.id);
    this.server
      .to([receiverSocketId, client.id])
      .emit('receive-message', message);
  }
  @SubscribeMessage('get-messages')
  async handleGetMessages(
    @MessageBody() data: { userAID: string; userBID: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Obtener todos los mensajes entre los usuarios A y B
      const { messages, participants } =
        await this.messService.getAllMessagesWith(data.userAID, data.userBID);

      // Formatear los mensajes para que coincidan con la interfaz IConversation
      const conversation: ConversationDto = {
        participants: participants,
        messages: messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sentAt: msg.sentAt,
          sender: msg.sender,
          receiver: msg.receiver,
        })),
      };

      // Emitir al cliente que solicitó la conversación completa
      client.emit('get-conversation-response', conversation);
    } catch (err) {
      console.log(`Error getting messages: ${err}`);
      client.emit('get-conversation-response', {
        error: 'Failed to retrieve messages',
      });
    }
  }
}
