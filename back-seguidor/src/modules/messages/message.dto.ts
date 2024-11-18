import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';

export class SendMessageDto {
  @IsNotEmpty()
  sender: Partial<User>;

  @IsNotEmpty()
  receiver: Partial<User>;

  @IsString()
  @MinLength(1, { message: 'Content must not be empty' })
  @MaxLength(500, { message: 'Content must be 500 characters or less' })
  content: string;
}

export class ConversationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  participants: User[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Message)
  messages: Message[];
}
