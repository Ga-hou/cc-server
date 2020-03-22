import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from './room.service';

@UseGuards(AuthGuard('jwt'))
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Post('list')
  getRoomList(@Req() req) {
    return this.roomService.findListById(req.user);
  }
}
