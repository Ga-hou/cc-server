import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketService } from '../socket.service';
import { LoginDto } from '../dto/agent/login.dto';
import { AgentService } from './agent.service';
import { MessageUtil } from '../../common/utils/message.util';

@UsePipes(
  new ValidationPipe({
    exceptionFactory: errors => {
      console.error(errors);
      return new WsException(errors);
    },
  }),
)
@WebSocketGateway(8082, { namespace: 'agent' })
export class AgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AgentGateway');
  constructor(
    private readonly socketService: SocketService,
    private readonly agentService: AgentService,
    private readonly messageUtil: MessageUtil,
  ) {}

  handleConnection(client: Socket) {
    this.logger.error('客服连接', client.id);
    this.logger.error(
      '当前客服在线人数: ' + Object.keys(this.server.clients().sockets).length,
    );
  }
  async handleDisconnect(client: Socket) {
    this.logger.error('客服断开连接', client.id);
    if (await this.agentService.logout(client.id)) {
      this.logger.error('Client logout success', client.id);
    }
  }
  @SubscribeMessage('login')
  async handleLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LoginDto,
  ): Promise<WsResponse> {
    this.logger.error('客服登录', client.id);
    return {
      event: 'login',
      data: this.messageUtil.createSystemMessage(
        await this.agentService.findOneSocket(data.payload.id, client),
      ),
    };
  }

  @SubscribeMessage('rooms')
  async handleGetRooms(@ConnectedSocket() client: Socket): Promise<WsResponse> {
    this.logger.error('获取客服所在房间', client.id);
    return {
      event: 'rooms',
      data: this.messageUtil.createSystemMessage(
        await this.socketService.findRoomsByClientId(client.id),
      ),
    };
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data) {
    this.logger.error('客服发送消息', data.payload.text);
    console.log(this.server.of('/user'))
    console.log(Object.keys(this.server))
  }
}
