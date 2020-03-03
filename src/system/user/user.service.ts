import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { UserEntity } from './user.entity';
import { ResponseInterface } from '../../common/interfaces/response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptoUtil } from '../../common/utils/crypto.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cryptoUtil: CryptoUtil,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async findOneByUserName(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ username });
  }

  async create(user: CreateUserDto): Promise<ResponseInterface> {
    const existing = await this.findOneByUserName(user.username);
    if (existing) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: '用户已存在',
      };
    }
    if (user.password !== user.confirmPassword) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: '两次输入密码不一致',
      };
    }
    user.password = this.cryptoUtil.encryptPassword(user.password);
    let newUser = new UserEntity();
    newUser = { ...user, ...newUser };
    const result = await this.userRepository.save(newUser);
    return {
      statusCode: HttpStatus.OK,
      data: {
        result,
      },
    };
  }

  async profile(id: number): Promise<ResponseInterface> {
    const user = await this.userRepository.findOne(id, {
      relations: ['userRoles', 'userRooms'],
    });
    if (!user) {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        error: '该用户不存在或已删除',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      data: {
        user: classToPlain(user),
      },
    };
  }

  // async findList({ pageSize = 10, pageNum = 1, username }) {
  //   return await this.userRepository.findAndCount();
  // }
}
