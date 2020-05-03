import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from 'socket.io';
import { Repository, Like, In } from 'typeorm';
import { ResponseDto } from '../dto/response.dto';
import { SocketEntity } from '../socket.entity';
import { Queue } from '../../common/DataStructures/Queue/Queue';
import { UserEntity } from '../../system/user/user.entity';
import { RoomEntity } from '../room/room.entity';
import { SocketRoomEntity } from '../room/relations/SocketRoom.entity';
import { MessageUtil } from '../../common/utils/message.util';
import { SocketServiceResponseDto } from '../dto/socket.service.response.dto';
import { RoomService } from '../room/room.service';
import { LoginDto } from '../dto/agent/login.dto';
import { SocketService } from '../socket.service';
import { SocketInterface } from '../socket.interface';

@Injectable()
export class AgentService {
  public clients: Queue<Socket>;
  private logger = new Logger('AgentService');
  constructor(
    @InjectRepository(SocketEntity)
    private readonly socketRepository: Repository<SocketEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(SocketRoomEntity)
    private readonly socketRoomRepository: Repository<SocketRoomEntity>,
    private readonly messageUtil: MessageUtil,
    private readonly roomService: RoomService,
    private readonly socketService: SocketService
  ) {
    this.clients = new Queue<Socket>();
  }

  /**
   * 通过用户ID查找socket表
   * 如果不存在则创建
   * 并把用户加入到clients队列里
   * @param userId 用户ID
   * @param client Socket对象
   */
  async findOneSocket(
    userId: number,
    client: Socket,
  ): Promise<SocketServiceResponseDto> {
    let result;
    let socket = await this.socketRepository.findOne({
      userId,
    });
    if (!socket) {
      socket = new SocketEntity();
    }
    socket.userId = userId;
    socket.clientId = client.id;
    socket.online = true;

    try {
      result = await this.socketRepository.save(socket);
      this.clients.enqueue(client);
    } catch (e) {
      this.logger.error(e);
      console.error(e);
      result = false;
    }
    if (!result) {
      return {
        statusCode: 500,
        data: 'login fail',
      };
    }
    return {
      statusCode: 200,
      data: 'login success',
    };
  }
  async logout(clientId: string) {
    try {
      return await this.socketRepository.update(
        {
          clientId,
        },
        {
          online: false,
          clientId: '',
        },
      );
    } catch (e) {
      this.logger.error('坐席下线成功', clientId);
    }
  }
  /**
   * 退出房间
   */
  async leave(server: Server, client: SocketInterface) {
    this.logger.log('离开房间')
    this.socketService.removeFeed(server, client);

    /**
     * 把客服从房间的服务客服里面删除
     */
    try {
      // this.clients.enqueue(client);
      // const socket = await this.socketRepository.findOne({
      //   clientId: client.id,
      // }, {
      //   relations: ['socketRooms']
      // })
      // const ids = socket.socketRooms.map(e => e.id
      // await this.roomRepository.remove({ id: In(ids) })
      // await this.socketRoomRepository.remove(socket.socketRooms)
      // await this.socketRepository.save(socket);
    } catch (error) {
      console.log('坐席房间删除失败', error)
    }
  }

  /**
   * 处理坐席登录
   * 主要是在socket表操作
   * @param client 
   * @param data 
   */
  async handleLogin(client: Socket, data: LoginDto) {
    let result = null;
    try {
      result = await this.findOneSocket(data.payload.id, client)
    } catch(e) {
      this.logger.error('坐席登录失败')
      client.emit('login', this.messageUtil.createSystemMessage({
        text: '坐席登录失败'
      }))
    }
    this.logger.log('坐席登录成功')
    client.emit('login', this.messageUtil.createSystemMessage(result))
  }

  /**
   * 查找用户所在房间列表
   * @param client 
   */
  async handleRooms(client: Socket) {
    const result = await this.socketService.findRoomsByClientId(client.id)
    client.emit('rooms', this.messageUtil.createSystemMessage(result))
  }

  /**
   * 处理坐席加入房间
   */

  async handleJoinRoom(client: SocketInterface, name: string) {
    client.join(name)
    client.room = name
    return [
      null,
      this.describeRoom(client, name)
    ]
  }

  describeRoom(client: SocketInterface, name: string) {
    const adapter = client.nsp.adapter;
    const clients = adapter.rooms[name] ? adapter.rooms[name].sockets : {};
    const result = {
        clients: {}
    };
    Object.keys(clients).forEach(function (id) {
        result.clients[id] = (adapter.nsp.connected[id] as SocketInterface).resources;
    });
    console.log(clients)
    console.log('room result', result)
    return result;
  }

  safeCb(cb?: Function): Function {
    if (typeof cb === 'function') {
      return cb;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return function() {}
  }
}
