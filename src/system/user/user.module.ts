import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { RolesService } from '../roles/roles.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { AuthModule } from '../auth/auth.module';
import { RoomEntity } from '../../socket/room/room.entity';
import { EmailUtil } from '../../common/utils/email.util';
import { RolesEntity } from '../roles/roles.entity';
import { GroupEntity } from '../group/group.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity, RoomEntity, RolesEntity, GroupEntity]),
  ],
  providers: [UserService, RolesService, CryptoUtil, EmailUtil],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
