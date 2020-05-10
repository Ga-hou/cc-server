import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WsResponse,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { MessageUtil } from '../../common/utils/message.util';
import { SocketUtil } from '../socket.util';
import { SocketService } from '../socket.service';
import { UserService } from './user.service';
import { SystemMessageDto } from '../dto/system.message.dto';
import { AgentService } from '../agent/agent.service';

@UsePipes(
  new ValidationPipe({
    exceptionFactory: errors => {
      console.error(errors);
      return new WsException(errors);
    },
  }),
)
@WebSocketGateway(8082, { namespace: 'user' })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('UserGateway');
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly messageUtil: MessageUtil,
    private readonly socketUtil: SocketUtil,
    private readonly agentService: AgentService,
  ) {}
  handleConnection(client: Socket) {
    this.logger.log('用户连接', client.id);
  }
  async handleDisconnect(client: Socket) {
    this.logger.log('用户断开连接', client.id);
    await this.userService.logout(client.id);
  }
  // WebRTC event
  @SubscribeMessage('create')
  async handleJoin(client: Socket) {
    this.logger.log('创建用户房间', client.id);
  }

  // event
  @SubscribeMessage('login')
  async handleLogin(client: Socket): Promise<WsResponse> {
    this.logger.log('用户登录', client.id);
    const result = await this.roomService.create(client);
    return {
      event: 'login',
      data: this.messageUtil.createSystemMessage(result),
    };
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket) {
    this.logger.log('收到用户消息', client.id);
    const clients = this.agentService.clients;
    const sockets = this.socketUtil.getRoomUser(client);
    const socketsCount = Object.keys(sockets).length;
    if (clients.isEmpty()) {
      return {
        event: 'message',
        data: this.messageUtil.createSystemMessage({
          text: '当前没有客服在线',
        }),
      };
    } else if (socketsCount === 1) {
      this.logger.log('开始分配客服', client.id);
      await this.userService.handleBeforeArtificial(client);
      return {
        event: 'message',
        data: this.messageUtil.createSystemMessage({
          text: '分配客服中',
        }),
      };
    }
  }

  // 业务自定义消息
  @SubscribeMessage('system')
  async sendWelcome(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SystemMessageDto,
  ) {
    this.logger.log(
      'receive system message type: ' + data.payload.type,
      client.id,
    );
    console.log(this.server.of('/agent'));
    if (data.payload.type === 1) {
      return {
        event: 'message',
        data: this.messageUtil.createSystemMessage({
          text: '欢迎。。。',
        }),
      };
    }
    return {
      event: 'system',
      data: null,
    };
  }
}
