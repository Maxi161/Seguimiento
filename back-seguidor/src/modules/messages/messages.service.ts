import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messRepo: Repository<Message>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async saveMessage(
    receiver: Partial<User>,
    content: string,
    sender: Partial<User>,
  ) {
    try {
      const userSender = await this.userRepo.findOne({
        where: { id: sender.id },
        select: ['email', 'name', 'id', 'role'],
      });
      const userReceiver = await this.userRepo.findOne({
        where: { id: receiver.id },
        select: ['email', 'name', 'id', 'role'],
      });

      if (!userSender) {
        throw new HttpException(
          { status: 404, error: 'Sender not found' },
          404,
        );
      }
      if (!userReceiver) {
        throw new HttpException(
          { status: 404, error: 'Receiver not found' },
          404,
        );
      }

      const message: Partial<Message> = {
        receiver: userReceiver,
        sender: userSender,
        sentAt: new Date(),
        content: content,
      };

      return await this.messRepo.save(message);
    } catch (error) {
      throw new HttpException(
        { status: 500, error: `Could not save message: ${error}` },
        500,
      );
    }
  }

  async getAllMessagesWith(sender: string, receiver: string) {
    const userSender = await this.userRepo.findOne({
      where: { id: sender },
      select: ['email', 'name', 'id', 'role'],
    });
    const userReceiver = await this.userRepo.findOne({
      where: { id: receiver },
      select: ['email', 'name', 'id', 'role'],
    });

    if (!userSender) {
      throw new HttpException({ status: 404, error: 'Sender not found' }, 404);
    }
    if (!userReceiver) {
      throw new HttpException(
        { status: 404, error: 'Receiver not found' },
        404,
      );
    }

    const messages = await this.messRepo.find({
      where: [
        { sender: userSender, receiver: userReceiver },
        { sender: userReceiver, receiver: userSender },
      ],
      order: { sentAt: 'ASC' },
      select: ['sender', 'content', 'receiver', 'id', 'sentAt'],
      relations: ['receiver', 'sender'],
    });

    messages.map((msg) => {
      if (msg.receiver.name === userReceiver.name) {
        msg.receiver = userReceiver;
        msg.sender = userSender;
      }
      msg.receiver = userSender;
      msg.sender = userReceiver;
    });

    console.log(sender, receiver);
    console.log(messages);

    return {
      messages: messages,
      participants: [userSender, userReceiver],
    };
  }
}
