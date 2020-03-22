import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './roles.entity';
import { ResponseInterface } from '../../common/interfaces/response.interface';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly roleRepository: Repository<RolesEntity>,
  ) {}

  async findAll(): Promise<ResponseInterface> {
    const roles = await this.roleRepository.find();
    return {
      statusCode: HttpStatus.OK,
      data: {
        roles,
      },
    };
  }

  async findOneById(id: number) {
    return await this.roleRepository.findOne(id);
  }
}
