import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.userService.onHandleCreate(user);
  }
  // @Post('list')
  // findList() {}

  @Post('profile')
  async profile(@Request() req) {
    const user = req.user;
    return this.userService.onHandleGetProfile(user.id);
  }

  // update() {}
}
