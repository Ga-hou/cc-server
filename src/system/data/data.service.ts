import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as dayjs from 'dayjs';
import { OverviewEntity } from './overview.entity';
import { OverviewDto } from './overview.dto';
import { ResponseInterface } from '../../common/interfaces/response.interface';
@Injectable()
export class DataService {
  constructor(
    @InjectRepository(OverviewEntity)
    private readonly overviewRepository: Repository<OverviewEntity>,
  ) {}

  async overview(data: OverviewDto): Promise<ResponseInterface> {
    const overviewData = await this.overviewRepository.findOne({
      where: {
        createTime: Between(
          dayjs()
            .startOf('day')
            .toDate(),
          dayjs()
            .endOf('day')
            .toDate(),
        ),
      },
    });
    return {
      statusCode: HttpStatus.OK,
      data: overviewData,
    };
  }
}
