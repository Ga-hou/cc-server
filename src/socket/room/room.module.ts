import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { UserEntity } from '../../system/user/user.entity';
import { RoomEntity } from './room.entity';
import { RoomController } from './room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity])],
  providers: [RoomService],
  exports: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
