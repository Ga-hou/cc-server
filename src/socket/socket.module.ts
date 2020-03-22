import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../system/user/user.entity';
import { AgentGateway } from './agent.gateway';
import { UserGateway } from './user.gateway';
import { UserService } from '../system/user/user.service';
import { RoomService } from './room/room.service';
import { GroupEntity } from '../system/group/group.entity';
import { RolesEntity } from '../system/roles/roles.entity';
import { RolesService } from '../system/roles/roles.service';
import { CryptoUtil } from '../common/utils/crypto.util';
import { EmailUtil } from '../common/utils/email.util';
import { RoomEntity } from './room/room.entity';
import { SocketService } from './socket.service';
import { SocketEntity } from './socket.entity';
import { MessageUtil } from '../common/utils/message.util';
import { SocketUtil } from './socket.util';
import { Queue } from '../common/DataStructures/Queue/Queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GroupEntity,
      RolesEntity,
      RoomEntity,
      SocketEntity,
    ]),
  ],
  providers: [
    AgentGateway,
    UserGateway,
    UserService,
    RoomService,
    SocketService,
    RolesService,
    CryptoUtil,
    EmailUtil,
    MessageUtil,
    SocketUtil,
    Queue,
  ],
})
export class SocketModule {}
