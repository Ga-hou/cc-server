import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { OverviewEntity } from './overview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OverviewEntity])],
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}
