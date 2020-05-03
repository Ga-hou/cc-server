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
  OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketService } from './socket.service';
import { LoginDto } from './dto/agent/login.dto';
import { AgentService } from './agent/agent.service';
import { MessageUtil } from '../common/utils/message.util';
import { RoomService } from './room/room.service';
import { SocketUtil } from './socket.util';
import { UserService } from './user/user.service';
import { MessageDto } from './dto/message.dto';
import { SocketInterface } from './socket.interface'
import * as crypto from 'crypto'
import config from '../config'

@UsePipes(
  new ValidationPipe({
    exceptionFactory: errors => {
      errors.forEach(e => {
        console.error(e)
        console.error(e.children)
      })
      return new WsException(errors);
    },
  }),
)
@WebSocketGateway(8082)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');
  constructor(
    private readonly socketService: SocketService,
    private readonly agentService: AgentService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly messageUtil: MessageUtil,
    private readonly socketUtil: SocketUtil,
  ) {}

  // 连接成功，前端发起login
  handleConnection(client: SocketInterface) {
    this.logger.log('连接', client.id);
    this.logger.log(
      '当前在线人数: ' + Object.keys(this.server.clients().sockets).length,
    );
    client.resources = {
      screen: false,
      video: true,
      audio: false
    }

    client.emit('stunservers', config.stunservers || []);

    // create shared secret nonces for TURN authentication
    // the process is described in draft-uberti-behave-turn-rest
    const credentials = [];
    // allow selectively vending turn credentials based on origin.
    const origin = client.handshake.headers.origin;
    if (!(config as any).turnorigins || (config as any).turnorigins.indexOf(origin) !== -1) {
        config.turnservers.forEach(function (server) {
            const hmac = crypto.createHmac('sha1', server.secret);
            // default to 86400 seconds timeout unless specified
            const username = Math.floor(new Date().getTime() / 1000) + (parseInt(String(server.expiry || 86400), 10)) + "";
            hmac.update(username);
            credentials.push({
                username: username,
                credential: hmac.digest('base64'),
                urls: server.urls
            });
        });
    }
    client.emit('turnservers', credentials);
  }

  // 1. 客服断开连接设置状态
  // 2. 用户断开连接删除房间
  async handleDisconnect(client: SocketInterface) {
    this.logger.log('断开连接', client.id);
    if (await this.agentService.logout(client.id)) {
      this.logger.log('坐席下线成功', client.id);
    }
    if (await this.userService.logout(client.id)) {
      this.logger.log('用户下线成功')
    }

    this.socketService.removeFeed(this.server, client)
  }

  async afterInit(client: SocketInterface) {
    
  }

  // 1. 客服login成功后，获取room
  @SubscribeMessage('login')
  async handleLogin(
    @ConnectedSocket() client: SocketInterface,
    @MessageBody() data: LoginDto,
  ) {
    this.logger.log('登录角色' + data.role, client.id);
    if (data.role === 'user') this.userService.handleLogin(client);
    else if(data.role === 'agent') this.agentService.handleLogin(client, data);
    else this.logger.error('用户角色不正确！');
  }

  @SubscribeMessage('message')
  async handleUserMessage(client: Socket, data) {
    this.logger.log('收到消息', client.id);
    console.log(data)

    // if (data.role === 'agent') {}
    // else if (data.role === 'user') this.userService.handleMessage(client, data)
    // else {
      if (!data) return;
      const otherClient = this.server.to(data.to);
      if (!otherClient) return;

      data.from = client.id;
      otherClient.emit('message', data);
    // }
  }

  // 业务自定义消息
  @SubscribeMessage('system')
  async sendWelcome(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    this.logger.log('收到自定义消息', client.id);
    console.log(data)
    console.log()
    if (data.payload.type === 1) this.userService.handleWelcome(client)
    else if (data.role === 'user') this.userService.handleMessage(client, data)
  }

  @SubscribeMessage('rooms')
  async handleAgentGetRooms(client: Socket) {
    this.logger.log('获取客服所在房间', client.id);
    await this.agentService.handleRooms(client);
  }

  /**
   * 坐席加入房间请求
   * @param client 
   * @param name 
   */
  @SubscribeMessage('join')
  async handleJoin(client: SocketInterface, name: string) {
    return await this.agentService.handleJoinRoom(client, name)
  }

  @SubscribeMessage('joinedRoom')
  async handleJoinedRoom(client: SocketInterface) {
    this.logger.log('已经加入房间', client.id)
  }

  /**
   * 处理webRTC创建房间请求
   * @param client 
   * @param data 
   */
  @SubscribeMessage('create')
  async handleCreateRoom(client: SocketInterface, data) {
    console.log(data)
    /**
     * 目前只能用户创建房间
     */
    if (data.role === 'user') this.userService.handleCreateRoom(client)
    else {
      this.logger.error('收到其他角色创建房间请求', client.id)
    }
  }
  /**
   * 退出房间
   * @param client
   */
  @SubscribeMessage('leave')
  async handleLeaveRoom(client: SocketInterface) {
    await this.agentService.leave(this.server, client);
  }
  /**
   * 分享屏幕
   */
  @SubscribeMessage('shareScreen')
  async handleShareScreen(client: SocketInterface) {
    client.resources.screen = true
    this.logger.log('分享屏幕');
  }
  /**
   * 停止分享
   */
  @SubscribeMessage('unshareScreen')
  async handleUnShareScreen(client: SocketInterface) {
    client.resources.screen = false
    this.logger.log('停止分享屏幕');
  }

  @SubscribeMessage('trace')
  async handleTrace(client: SocketInterface, data: any) {
    console.log('trace', JSON.stringify(
      [data.type, data.session, data.prefix, data.peer, data.time, data.value]
      ));
  }
}
