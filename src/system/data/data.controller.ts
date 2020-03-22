import { Body, Controller, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DataService } from './data.service';
import { OverviewDto } from './overview.dto';

@Controller('data')
@UseGuards(AuthGuard('jwt'))
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('overview')
  async overview(@Body() data: OverviewDto) {
    return await this.dataService.overview(data);
  }
}
