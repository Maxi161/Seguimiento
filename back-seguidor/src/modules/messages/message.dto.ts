import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsUUID('4')
  sender: string;

  @IsUUID('4')
  receiver: string;

  @IsString()
  @MinLength(1, { message: 'Content must not be empty' })
  @MaxLength(500, { message: 'Content must be 500 characters or less' })
  content: string;
}
