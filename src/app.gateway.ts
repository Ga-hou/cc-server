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
import { HttpStatus, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { RoomService } from './socket/room/room.service';
import { UserService } from './system/user/user.service';
import { MessageInterface } from './common/interfaces/message.interface';
import { MessageUtil } from './common/utils/message.util';
import { config } from './config';

@WebSocketGateway(8082)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly messageUtil: MessageUtil,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Socket Server Init');
  }
  async handleConnection(client: Socket) {
    this.logger.log('Client connected: ', client.id);
  }
  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected: ', client.id);
  }
  @SubscribeMessage('login')
  async handleLogin(client: Socket, message: MessageInterface) {
    this.logger.log('Client login', client.id);
    // const userInfo = message.payload.data.userInfo;
    // await this.roomService.create({
    //   username: userInfo.username,
    //   id: userInfo.userRoles.id,
    // });
    // this.server.emit('login', 'login success');
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: MessageInterface,
    @ConnectedSocket() client: Socket,
  ): string {
    const otherClient = this.server.to(data.to);
    if (!otherClient) return;
    data.from = data.to;
    otherClient.emit('message', data);
  }

  @SubscribeMessage('join')
  async handleJoin(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(data, client.id);
    const response = await this.roomService.findOneByRoomName(data.roomName);
    if (response.statusCode === 200) {
      client.join(data.roomName);
      this.server.emit(
        'join',
        this.messageUtil.createSystemMessage({
          statusCode: HttpStatus.OK,
        }),
      );
    }
    this.server.emit(
      'join',
      this.messageUtil.createSystemMessage({
        statusCode: HttpStatus.BAD_REQUEST,
        error: '房间不存在',
      }),
    );
  }

  async removeFeed(client: Socket) {
    // if (client.rooms)
  }

  @SubscribeMessage('trace')
  async handleTrace(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log(
      JSON.stringify([
        data.type,
        data.session,
        data.prefix,
        data.peer,
        data.time,
        data.value,
      ]),
      client.id + 'trace',
    );
  }

  afterConnection(client: Socket) {
    client.emit('stunservers', config.stunservers || []);
    client.emit('turnservers', []);
    // const credentials = [];
    // const origin = client.handshake.headers.origin;
    // if (config.turnorigins && config.turnorigins.index) {}
  }
}
