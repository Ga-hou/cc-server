import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../system/user/user.entity';
import { UserService } from './user/user.service';
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
import { SocketRoomEntity } from './room/relations/SocketRoom.entity';
import { AgentService } from './agent/agent.service';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GroupEntity,
      RolesEntity,
      RoomEntity,
      SocketEntity,
      SocketRoomEntity,
    ]),
  ],
  providers: [
    UserService,
    RoomService,
    SocketService,
    RolesService,
    AgentService,
    CryptoUtil,
    EmailUtil,
    MessageUtil,
    SocketUtil,
    Queue,
    SocketGateway,
  ],
})
export class SocketModule {}
