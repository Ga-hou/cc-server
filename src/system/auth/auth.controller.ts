import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain } from 'class-transformer';
import { UserService } from '../user/user.service';
import { AuthUserDTO } from './dto/auth-user.dto';
import { AuthService } from './auth.service';
import { ResponseInterface } from '../../common/interfaces/response.interface';
import { CryptoUtil } from '../../common/utils/crypto.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly cryptoUtil: CryptoUtil,
  ) {}

  @Post('login')
  async login(@Body() authUser: AuthUserDTO): Promise<ResponseInterface> {
    const user = await this.userService.findOneByAccount(authUser.account);
    // 用户不存在
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: '账号或密码错误',
        },
        401,
      );
    }
    // 密码错误
    if (!this.cryptoUtil.checkPassword(authUser.password, user.password)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: '账号或密码错误',
        },
        401,
      );
    }
    const token = await this.authService.createToken({
      account: user.account,
      id: user.id,
    });
    return {
      statusCode: HttpStatus.OK,
      data: {
        token,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('check')
  async checkLogin(@Request() body) {
    return {
      statusCode: HttpStatus.OK,
      data: {},
    };
  }
}
