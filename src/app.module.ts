import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import Configuration from './config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './system/auth/auth.module';
import { UserModule } from './system/user/user.module';
import { DeptModule } from './system/dept/dept.module';
import { RolesModule } from './system/roles/roles.module';
import { AppGateway } from './app.gateway';
import { RoomModule } from './socket/room/room.module';
import { ChatModule } from './socket/chat/chat.module';
import config from './config';
import { MessageUtil } from './common/utils/message.util';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
    }),
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
