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
import { UserService } from '../system/user/user.service';
import { MessageInterface } from '../common/interfaces/message.interface';
import { SocketService } from './socket.service';

@WebSocketGateway(8082, { namespace: 'agent' })
export class AgentGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AgentGateway');
  constructor(
    private readonly userService: UserService,
    private readonly socketService: SocketService,
  ) {}
  afterInit(server: Server) {
    this.logger.log('Socket Server Init');
  }
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
  async handleLogin(client: Socket, data) {
    this.logger.log('Agent login', client.id);
    const result = await this.socketService.login(data.payload.id, client.id);
    if (!result) {
      client.emit('login', 'login fail');
    } else {
      client.emit('login');
    }
  }

  @SubscribeMessage('rooms')
  async handleGetRooms(client: Socket) {
    console.log(client.id)
    client.emit('rooms', await this.socketService.findRooms(client.id));
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.logger.log('Client message', data);
  }

  @SubscribeMessage('test')
  test() {
    this.logger.error('test');
  }
}
