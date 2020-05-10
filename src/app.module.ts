import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import Configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './system/auth/auth.module';
import { UserModule } from './system/user/user.module';
import { DeptModule } from './system/dept/dept.module';
import { RolesModule } from './system/roles/roles.module';
import { RoomModule } from './socket/room/room.module';
import { MessageUtil } from './common/utils/message.util';
import { DataModule } from './system/data/data.module';
import { GroupModule } from './system/group/group.module';
import { SocketModule } from './socket/socket.module';
import { ConversationModule } from './system/conversation/conversation.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
    }),
    TypeOrmModule.forRoot(config.orm as TypeOrmModuleOptions),
    HttpModule,
    AuthModule,
    UserModule,
    DeptModule,
    RolesModule,
    RoomModule,
    DataModule,
    GroupModule,
    SocketModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService, MessageUtil],
})
export class AppModule {}
