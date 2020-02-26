import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './system/auth/auth.module';
import { UserModule } from './system/user/user.module';
import { DeptModule } from './system/dept/dept.module';
import { RolesModule } from './system/roles/roles.module';
import config from './config';
@Module({
  imports: [AuthModule, UserModule,
    TypeOrmModule.forRoot(config.orm as TypeOrmModuleOptions),
    DeptModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
