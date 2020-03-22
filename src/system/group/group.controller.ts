import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('group')
@UseGuards(AuthGuard('jwt'))
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  async create(@Body() groupData: CreateGroupDto) {
    return await this.groupService.create(groupData);
  }

  @Post('list')
  async groupList() {
    return await this.groupService.findAll();
  }

  @Post('detail')
  async detail(@Body() data: { groupId: string }) {
    return await this.groupService.findOneById(data.groupId);
  }

  @Post('delete')
  async delete(@Body() data: { groupId: string }) {
    return await this.groupService.delete(data.groupId);
  }

  @Post('user')
  async userList(@Body() data: { groupId: string }) {
    return await this.groupService.findUserById(data.groupId);
  }

  @Post('update')
  async update(@Body() data: UpdateGroupDto) {
    return await this.groupService.update(data);
  }
}
