import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './system/auth/auth.module';
import { UserModule } from './system/user/user.module';
import { DeptModule } from './system/dept/dept.module';
import { RolesModule } from './system/roles/roles.module';
import { AppGateway } from './app.gateway';
import { RoomModule } from './socket/room/room.module';
import { ChatModule } from './socket/chat/chat.module';
import { RoomService } from './socket/room/room.service';
import config from './config';
import { MessageUtil } from './common/utils/message.util';
@Module({
  imports: [
    TypeOrmModule.forRoot(config.orm as TypeOrmModuleOptions),
    AuthModule,
    UserModule,
    DeptModule,
    RolesModule,
    RoomModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, MessageUtil],
})
export class AppModule {}
