import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
// import { CreateTextMessageDTO } from './dto/create-text-message.dto';
// import { MessageInterface } from '../../interfaces/message.interface';
@Injectable()
export class MessageUtil {
  public createSystemMessage(message) {
    return {
      id: ulid(),
      timestamp: Date.now(),
      flow: 'in',
      from: 'system',
      payload: {
        message,
      },
    };
  }
}
