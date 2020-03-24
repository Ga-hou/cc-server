import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
@Injectable()
export class SocketUtil {
  getRoomUser(client: Socket) {
    return client.adapter.rooms[client.id].sockets || {};
  }


}
