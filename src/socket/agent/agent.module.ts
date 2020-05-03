import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentService } from './agent.service';
import { AgentGateway } from './agent.gateway';
import { MessageUtil } from '../../common/utils/message.util';
import { UserEntity } from '../../system/user/user.entity';
import { GroupEntity } from '../../system/group/group.entity';
import { RolesEntity } from '../../system/roles/roles.entity';
import { RoomEntity } from '../room/room.entity';
import { SocketEntity } from '../socket.entity';
import { SocketRoomEntity } from '../room/relations/SocketRoom.entity';
import { UserService } from '../user/user.service';
import { SocketService } from '../socket.service';

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
    AgentService,
    AgentGateway,
    MessageUtil,
    UserService,
    SocketService,
  ],
})
export class AgentModule {}
