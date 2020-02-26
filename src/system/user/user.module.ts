import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
  ],
  providers: [UserService, CryptoUtil],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
