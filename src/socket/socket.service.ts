import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../system/user/user.entity';
import { Repository } from 'typeorm';
import { SocketEntity } from './socket.entity';
import { Queue } from '../common/DataStructures/Queue/Queue';
import { Socket } from 'socket.io';
import { MessageUtil } from '../common/utils/message.util';
import { RoomEntity } from './room/room.entity';
import { SocketRoomEntity } from './room/relations/SocketRoom.entity';

@Injectable()
export class SocketService {
  public clients: Queue<Socket>;
  private logger: Logger = new Logger('SocketService');
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
  ) {
    this.clients = new Queue<Socket>();
  }
  async login(userId: number, client: Socket) {
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
      console.log(e);
      result = false;
    }

    return result;
  }

  async logout(clientId: string) {
    return await this.socketRepository.update(
      {
        clientId,
      },
      {
        online: false,
        clientId: '',
      },
    );
  }

  async findOnlineAgent(userClient: Socket): Promise<[Socket, RoomEntity]> {
    let agentClient: Socket;
    let roomEntity: RoomEntity;
    let socketEntity: SocketEntity;
    while (!this.clients.isEmpty()) {
      agentClient = this.clients.dequeue();
      try {
        socketEntity = await this.socketRepository.findOne({
          clientId: agentClient.id,
        });
      } catch (e) {
        console.log(e);
      }
      if (socketEntity.online) {
        this.logger.log('找到空闲客服');
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
        console.log(socketRoomEntity);
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

  async findRooms(clientId: string): Promise<RoomEntity[]> {
    let socketRoom: SocketRoomEntity;
    try {
      socketRoom = await this.socketRoomRepository.findOne(
        {
          clientId,
        },
        {
          relations: ['rooms'],
        },
      );
    } catch (e) {
      this.logger.error('agent find rooms fail');
      return [];
    }
    if (socketRoom && socketRoom.rooms) {
      return socketRoom.rooms;
    }
    return [];
  }

  async handleBeforeArtificial(client: Socket) {
    const [agentClient, room] = await this.findOnlineAgent(client);
    client.emit(
      'message',
      this.messageUtil.createSystemMessage({
        text: '转人工中，请等待',
      }),
    );
    agentClient.join(client.id);
    agentClient.emit(
      'event',
      this.messageUtil.createSystemMessage({
        type: 1,
        room,
      }),
    );
  }
}
