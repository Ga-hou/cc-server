import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomService } from './room/room.service';
import { MessageUtil } from '../common/utils/message.util';
import { SocketUtil } from './socket.util';
import { Queue } from '../common/DataStructures/Queue/Queue';
@WebSocketGateway(8082, { namespace: 'user' })
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('UserGateway');
  constructor(
    private readonly roomService: RoomService,
    private readonly messageUtil: MessageUtil,
    private readonly socketUtil: SocketUtil,
    private readonly queue: Queue<Socket>,
  ) {}
  afterInit(server: Server) {
    this.logger.log('Socket Server Init');
  }
  handleConnection(client: Socket) {
    this.logger.log('Client connected: ', client.id);
  }
  async handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected: ', client.id);
    // await this.roomService.leave(client.id);
  }
  // WebRTC event
  @SubscribeMessage('create')
  async handleJoin(client: Socket, data) {
    this.logger.log('Client create room', client.id);
    const room = client.adapter.rooms[data];
    // google existing room
    if (!room || !room.length) {
      client.join(client.id);
    }
    client.emit('create', await this.roomService.create(client.id));
  }

  // event
  @SubscribeMessage('login')
  async handleLogin(client: Socket) {
    this.logger.log('Client login', client.id);
    client.emit('login', 'login success');
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, data) {
    this.logger.log('Client message', client.id);
    console.log(data);
    const sockets = this.socketUtil.getRoomUser(client);
    const socketsCount = Object.keys(sockets).length;
    if (socketsCount === 1) {
      this.handleBeforeArtificial(client);
    }
  }

  // 业务自定义消息
  @SubscribeMessage('system')
  sendWelcome(
    client: Socket,
    payload: {
      type: number;
      data: any;
    },
  ) {
    this.logger.log('receive system message', client.id);
    if (payload.type === 1) {
      client.emit(
        'message',
        this.messageUtil.createSystemMessage({
          text: '欢迎。。。',
        }),
      );
    }
  }

  // 进房人工服务前
  handleBeforeArtificial(client: Socket) {
    client.emit(
      'message',
      this.messageUtil.createSystemMessage({
        text: '转人工中，请等待',
      }),
    );
  }
}
