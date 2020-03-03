import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity';
import { AuthModule } from '../auth/auth.module';
import { RoomEntity } from '../../socket/room/room.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity, RoomEntity]),
  ],
  providers: [UserService, CryptoUtil],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
