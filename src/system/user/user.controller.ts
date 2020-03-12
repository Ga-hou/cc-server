import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }
  // @Post('list')
  // findList() {}

  @Post('profile')
  async profile(@Request() req) {
    const user = req.user;
    return this.userService.profile(user.id);
  }

  @Post('list')
  async userList() {
    return await this.userService.findList();
  }

  @Post('reset')
  async resetPassword(@Body() id: number) {
    return await this.userService.reset(id);
  }

  @Post('update')
  async updateUserInfo(@Body() user: UpdateUserDto) {
    return await this.userService.update(user);
  }

  @Post('group')
  async getGroupUser(@Body() data: { groupId: string }) {
    // return await this.userService.findListByGroupId(data.groupId);
  }
}
