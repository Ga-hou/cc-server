import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';
import { SocketEntity } from '../socket.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../system/user/user.entity';
import { RoomEntity } from '../room/room.entity';
import { SocketRoomEntity } from '../room/relations/SocketRoom.entity';
import { MessageUtil } from '../../common/utils/message.util';
import { AgentService } from '../agent/agent.service';
import { RoomService } from '../room/room.service';
import { BaseMessageDto } from '../dto/baseMessage';
import { MessageDto } from '../dto/message.dto';
import { SocketUtil } from '../socket.util';
import { SocketInterface } from '../socket.interface';
import { SocketService } from '../socket.service';

@Injectable()
export class UserService {
  private logger = new Logger('socket user service');
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
    private readonly agentService: AgentService,
    private readonly roomService: RoomService,
    private readonly socketUtil: SocketUtil,
    private readonly socketService: SocketService,
  ) {}
  async logout(clientId: string) {
    try {
      return Promise.all([
        await this.roomRepository.delete({
          roomId: clientId,
        }),
        await this.socketRoomRepository.delete({
          roomId: clientId,
        }),
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  async findOnlineAgent(userClient: Socket): Promise<[Socket, RoomEntity]> {
    const clients = this.agentService.clients;
    let agentClient: Socket;
    let roomEntity: RoomEntity;
    let socketEntity: SocketEntity;
    while (!clients.isEmpty()) {
      agentClient = clients.dequeue();
      console.log('agentClient', agentClient.id);
      try {
        socketEntity = await this.socketRepository.findOne({
          clientId: agentClient.id,
        });
      } catch (e) {
        console.log(e);
      }
      if (socketEntity.online) {
        this.logger.log('找到空闲客服');
        console.log('clientId', agentClient.id);
        roomEntity = await this.roomRepository.findOne({
          roomId: userClient.id,
        });
        const socketRoomEntity = new SocketRoomEntity();
        socketRoomEntity.clientId = agentClient.id;
        socketRoomEntity.roomId = roomEntity.roomId;
        socketRoomEntity.status = 'before';
        socketRoomEntity.socket = socketEntity;
        if (!(socketRoomEntity.rooms instanceof Array)) {
          socketRoomEntity.rooms = [];
        }
        socketRoomEntity.rooms.push(roomEntity);
        try {
          await this.socketRoomRepository.save(socketRoomEntity);
        } catch (e) {
          console.error(e);
        }
        break;
      }
    }
    return [agentClient, roomEntity];
  }

  /**
   * 查找当前空闲客服
   * @param client
   */
  async handleBeforeArtificial(client) {
    const [agentClient, room] = await this.findOnlineAgent(client);
    agentClient.emit(
      'event',
      this.messageUtil.createSystemMessage({
        type: 1,
        room,
      }),
    );
  }

  /**
   * 处理用户登录请客
   * 在room表增加一个房间
   *
   * @param client
   */
  async handleLogin(client: Socket) {
    this.logger.log('用户登录', client.id);
    const result = await this.roomService.create(client);
    client.emit('login', this.messageUtil.createSystemMessage(result));
  }
  /**
   * 用户消息欢迎语
   */
  async handleWelcome(client: Socket) {
    this.logger.log('欢迎用户', client.id);
    client.emit(
      'message',
      this.messageUtil.createSystemMessage({
        text: '欢迎。。。。啊啊啊',
      }),
    );
  }

  /**
   * 处理用户message事件
   */
  async handleMessage(client: Socket, data: MessageDto) {
    this.logger.log('收到用户消息', client.id);
    const roomUserCount = this.socketUtil.getRoomUserCount(client);
    console.log('房间内人数', roomUserCount);
    if (roomUserCount > 1) return;
    else {
      /**
       * 房间内只有一个人时
       */
      if (roomUserCount === 1) this.handleOneUser(client);
      else {
        this.logger.error('其他情况');
      }
    }
  }

  /**
   * 处理没有客服在情况
   * @param client
   */
  async handleEmptyUser(client: Socket) {
    client.emit(
      'message',
      this.messageUtil.createSystemMessage({
        text: '当前没有客服在线啊啊啊',
      }),
    );
  }
  /**
   * 处理房间内只有一个用户时
   */
  async handleOneUser(client: Socket) {
    const status = await this.querySocketRoomStatus(client);
    /**
     * 等待客服进入
     */
    if (status === 'before') {
      await this.handleWaiting(client);
    } else if (this.agentService.clients.isEmpty()) {
    /**
     * 队列为空
     */
      this.handleEmptyUser(client);
    } else {
      this.logger.log('开始分配客服', client.id);
      await this.handleBeforeArtificial(client);
    }
  }
  /**
   *
   * @param client
   */
  async handleWaiting(client: Socket) {
    client.emit(
      'message',
      this.messageUtil.createSystemMessage({
        text: '等待客服进入。。。。',
      }),
    );
  }

  async findSocketRoomById(client: Socket) {
    return await this.socketRoomRepository.findOne({
      roomId: client.id,
    });
  }
  async querySocketRoomStatus(client: Socket) {
    const socketRoom = await this.findSocketRoomById(client);
    if (socketRoom && socketRoom.status === 'before') {
      return 'before';
    }
    return null;
  }
  /**
   * 用户进入创建房间
   * 通过clientId创建
   */
  async handleCreateRoom(client: SocketInterface) {
    const name = client.id;
    const room = client.nsp.adapter.rooms[name];
    this.logger.log('收到创建房间请求:' + name + JSON.stringify(room));
    try {
      await this.roomService.create(client);
      await this.socketService.join(client, name);
      client.emit(
        'create',
        this.messageUtil.createSystemMessage({
          text: name,
        }),
      );
      this.logger.log('创建房间成功');
    } catch (error) {
      console.error('创建房间失败', error);
    }
  }

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
}
