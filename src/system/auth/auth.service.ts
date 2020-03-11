import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async createToken(user: { account: string; id: number }) {
    const payload = { account: user.account, id: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: { id: number }): Promise<UserEntity> {
    return await this.userService.findOneById(payload.id);
  }
}
