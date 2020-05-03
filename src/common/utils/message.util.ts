import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { MessageInterface } from '../interfaces/message.interface';
// import { CreateTextMessageDTO } from './dto/create-text-message.dto';
@Injectable()
export class MessageUtil {
  public createSystemMessage(message) {
    return {
      sid: Date.now().toString(),
      id: ulid(),
      timestamp: Date.now(),
      flow: 'in',
      from: 'system',
      payload: message,
      type: 'chat'
    };
  }
}
