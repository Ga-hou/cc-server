import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  handleConnection(client: Socket) {
    console.log(client);
    return {};
  }

  handleDisconnect(client: Socket) {
    console.log(client);
    return {};
  }

  recordChatMessage(client: Socket, toUser: string, message) {
    return {};
  }
}
