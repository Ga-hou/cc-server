import { Module } from '@nestjs/common';
import { DeptService } from './dept.service';
import { DeptController } from './dept.controller';

@Module({
  providers: [DeptService],
  controllers: [DeptController]
})
export class DeptModule {}
