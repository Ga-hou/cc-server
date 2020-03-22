import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { Like, Repository, In } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ResponseInterface } from '../../common/interfaces/response.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<ResponseInterface> {
    const groupList = await this.groupRepository.findAndCount();
    return {
      statusCode: HttpStatus.OK,
      data: {
        groupList: groupList[0],
        count: groupList[1],
      },
    };
  }

  async findOneById(groupId: string): Promise<ResponseInterface> {
    const group = await this.groupRepository.findOne(
      { groupId },
      {
        relations: ['user'],
      },
    );
    if (!group) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '客服组不存在',
        },
        400,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: group,
    };
  }

  async findUserById(groupId: string): Promise<ResponseInterface> {
    const userList = await this.groupRepository.find({
      groupId,
    });
    return {
      statusCode: HttpStatus.OK,
      data: userList,
    };
  }

  async create(groupData: CreateGroupDto): Promise<ResponseInterface> {
    const existing = await this.groupRepository.findOne({
      groupName: groupData.groupName,
    });
    if (existing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '用户组名已存在',
        },
        400,
      );
    }
    const userEntityList = await this.userRepository.findByIds(
      groupData.userIdList,
    );
    const newGroup = new GroupEntity();
    newGroup.groupName = groupData.groupName;
    newGroup.user = userEntityList;
    const result = await this.groupRepository.save(newGroup);

    return {
      statusCode: HttpStatus.OK,
      data: {
        msg: '添加成功',
        result,
      },
    };
  }

  async delete(groupId: string): Promise<ResponseInterface> {
    const userGroup = await this.groupRepository.findOne({
      groupId,
    });

    if (!userGroup) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '用户组不存在',
        },
        400,
      );
    }
    const result = await this.groupRepository.remove(userGroup);

    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  async update(data: UpdateGroupDto): Promise<ResponseInterface> {
    const group = await this.groupRepository.findOne(
      {
        groupId: data.groupId,
      },
      {
        relations: ['user'],
      },
    );
    if (!group) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: '客服组不存在',
        },
        400,
      );
    }
    const userList = await this.userRepository.find({
      where: {
        id: In(data.userIdList),
      },
    });
    group.groupName = data.groupName;
    group.user = userList;

    console.log(userList);

    const result = await this.groupRepository.save(group);

    return {
      statusCode: HttpStatus.OK,
      data: {
        msg: '客服组修改成功',
      },
    };
  }
}
