import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { ulid } from 'ulid';
import { UserEntity } from './user.entity';
import { RolesEntity } from '../roles/roles.entity';
import { ResponseInterface } from '../../common/interfaces/response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { EmailUtil } from '../../common/utils/email.util';
import { RolesService } from '../roles/roles.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('user');
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
    private readonly cryptoUtil: CryptoUtil,
    private readonly emailUtil: EmailUtil,
  ) {}

  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async findOneByAccount(account: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ account });
  }

  async findList(): Promise<ResponseInterface> {
    const [userList, count] = await this.userRepository.findAndCount();
    return {
      statusCode: HttpStatus.OK,
      data: {
        userList: classToPlain(userList),
        count,
      },
    };
  }

  async profile(id: number): Promise<ResponseInterface> {
    const user = await this.userRepository.findOne(id, {
      relations: ['userRooms'],
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

  async create(user: CreateUserDto): Promise<ResponseInterface> {
    const existing = await this.findOneByAccount(user.account);
    let send = false;
    if (existing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '用户已存在',
        },
        400,
      );
    }
    const role = await this.rolesService.findOneById(user.roleId);
    if (!role) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '用户类型不存在',
        },
        400,
      );
    }

    const password = ulid().slice(0, 6);
    try {
      await this.emailUtil.send(user.account, password);
      send = true;
    } catch (e) {
      this.logger.error('send mail fail' + e.message);
    }

    if (!send) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '发送邮件失败，请联系管理员',
        },
        400,
      );
    }

    let newUser = new UserEntity();
    newUser.password = this.cryptoUtil.encryptPassword(password);
    newUser = { ...user, ...newUser };
    const result = await this.userRepository.save(newUser);
    return {
      statusCode: HttpStatus.OK,
      data: {
        send: '创建成功',
        result: classToPlain(result),
      },
    };
  }

  async reset(id: number): Promise<ResponseInterface> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '用户不存在',
        },
        400,
      );
    }
    let send = false;
    const password = ulid().slice(0, 6);
    try {
      await this.emailUtil.send(user.account, password);
      send = true;
    } catch (e) {}
    if (!send) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '发送邮件失败，请联系管理员',
        },
        400,
      );
    }
    user.password = password;
    const response = await this.userRepository.save(user);
    return {
      statusCode: HttpStatus.OK,
      data: {
        msg: '密码重置成功',
        response: classToPlain(response),
      },
    };
  }

  async update(updateUserInfo: UpdateUserDto): Promise<ResponseInterface> {
    const user = await this.findOneByAccount(updateUserInfo.account);
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '账号不存在',
        },
        400,
      );
    }
    user.username = updateUserInfo.username;
    user.roleId = updateUserInfo.roleId;

    const response = await this.userRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      data: {
        msg: '修改成功',
        response: classToPlain(response),
      },
    };
  }
}
