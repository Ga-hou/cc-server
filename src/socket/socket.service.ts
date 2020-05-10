import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from '../common/DataStructures/Queue/Queue';
import { Socket, Server } from 'socket.io';
import { SocketRoomEntity } from './room/relations/SocketRoom.entity';
import { SocketServiceResponseDto } from './dto/socket.service.response.dto';
import { SocketInterface } from './socket.interface';
import { SocketEntity } from './socket.entity';

@Injectable()
export class SocketService {
  public clients: Queue<Socket>;
  private logger: Logger = new Logger('SocketService');
  constructor(
    @InjectRepository(SocketRoomEntity)
    private readonly socketRoomRepository: Repository<SocketRoomEntity>,
    @InjectRepository(SocketEntity)
    private readonly socketRepository: Repository<SocketEntity>,
  ) {
    this.clients = new Queue<Socket>();
  }

  async findRoomsByClientId(
    clientId: string,
  ): Promise<SocketServiceResponseDto> {
    let socketRoom: SocketRoomEntity;
    let rooms = [];
    try {
      socketRoom = await this.socketRoomRepository.findOne(
        {
          clientId,
        },
        {
          relations: ['rooms'],
        },
      );
      if (socketRoom && socketRoom.rooms) {
        rooms = socketRoom.rooms;
      }
    } catch (e) {
      this.logger.error('agent find rooms fail');
      return {
        statusCode: 500,
        error: 'find rooms fail',
      };
    }
    return {
      statusCode: 200,
      data: rooms,
    };
  }

  /**
   * 加入房间处理
   */
  async join(client: SocketInterface, name: string) {
    client.join(name);
    client.room = name;
    return [null, this.describeRoom(client, name)];
  }

  // /**
  //  * 退出房间
  //  * @param client
  //  */
  // async leave(server: Server, client: SocketInterface) {
  //   this.logger.log('退出房间', client.id)
  //   this.removeFeed(server, client);
  //   /**
  //    * 客服
  //    */
  //   try {
  //     let socket = await this.socketRepository.findOne({
  //       clientId: client.id
  //     })
  //   } catch (error) {
  //     console.log('客服设置失败', error)
  //   }
  // }

  /**
   *
   * @param client
   * @param name
   */

  describeRoom(client: SocketInterface, name: string) {
    const adapter = client.nsp.adapter;
    const clients = adapter.rooms[name] ? adapter.rooms[name].sockets : {};
    const result = {
      clients: {},
    };
    Object.keys(clients).forEach(function(id) {
      result.clients[id] = (adapter.nsp.connected[
        id
      ] as SocketInterface).resources;
    });
    return result;
  }

  removeFeed(server: Server, client: SocketInterface, type?: string) {
    if (client.room) {
      server.sockets.in(client.room).emit('remove', {
        id: client.id,
        type: type,
      });
      if (!type) {
        client.leave(client.room);
        client.room = undefined;
      }
    }
  }
}
