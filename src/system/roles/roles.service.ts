import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './roles.entity';
import { UserEntity } from '../user/user.entity';
import { ResponseInterface } from '../../common/interfaces/response.interface'
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly roleRepository: Repository<RolesEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllRole(): Promise<ResponseInterface> {
    const roles = await this.roleRepository.find();
    return {
      statusCode: HttpStatus.OK,
      data: {
        roles
      }
    }
  }
}
