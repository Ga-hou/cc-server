import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { CreateTextMessageDTO } from './dto/create-text-message.dto';
import { MessageInterface } from '../../interfaces/message.interface';
@Injectable()
export class Message {
  public createTextMessage(
    textMessage: CreateTextMessageDTO,
  ): MessageInterface {
    return {
      id: ulid(),
      timestamp: Date.now(),
      flow: 'in',
      from: textMessage.username,
      payload: {},
    };
  }
}
