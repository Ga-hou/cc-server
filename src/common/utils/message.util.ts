import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
@Injectable()
export class MessageUtil {
  public createSystemMessage(message) {
    return {
      sid: Date.now().toString(),
      id: ulid(),
      timestamp: Date.now(),
      roomType: '',
      flow: 'in',
      from: 'system',
      username: 'admin',
      role: 'admin',
      payload: message,
      type: 'chat',
      prefix: '',
    };
  }
}
