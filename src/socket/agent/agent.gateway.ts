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
import { UserService } from '../system/user/user.service';
import { SocketService } from './socket.service';
import { LoginDto } from './dto/agent/login.dto';

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
    private readonly userService: UserService,
    private readonly socketService: SocketService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log('Client connected: ', client.id);
    this.logger.log(
      Object.keys(this.server.clients().sockets).length,
      'current online user count',
    );
  }
  async handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected: ', client.id);
    await this.socketService.logout(client.id);
  }
  @SubscribeMessage('login')
  async handleLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LoginDto,
  ): Promise<WsResponse> {
    this.logger.log('Agent login', client.id);
    return {
      event: 'login',
      data: await this.socketService.login(data.payload.id, client),
    };
  }

  @SubscribeMessage('rooms')
  async handleGetRooms(@ConnectedSocket() client: Socket): Promise<WsResponse> {
    this.logger.log('ger user rooms', client.id);
    const rooms = await this.socketService.findRooms(client.id);
    return {
      event: 'rooms',
      data: rooms,
    };
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data) {
    this.logger.log('Client message', data);
  }

  @SubscribeMessage('test')
  test() {
    this.logger.error('test');
  }
}
