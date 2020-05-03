import { Injectable } from '@nestjs/common';
import { Socket, Room, Server } from 'socket.io';
@Injectable()
export class SocketUtil {
  /**
   * 通过clientId获取房间
   * @param client 
   */
  getRoomUser(client: Socket): Room {
    return client.adapter.rooms[client.id];
  }

  /**
   * 获取房间内人数
   */
  getRoomUserCount(client: Socket): number {
    return Object.keys(this.getRoomUser(client).sockets).length
  }
}