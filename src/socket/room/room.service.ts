import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';
import { UserEntity } from '../../system/user/user.entity';
import { ResponseInterface } from '../../common/interfaces/response.interface';
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<ResponseInterface> {
    const rooms = await this.roomRepository.find();
    return {
      statusCode: HttpStatus.OK,
      data: {
        rooms,
      },
    };
  }

  async findOneByRoomId(roomId: string) {
    return await this.roomRepository.find({ roomId });
  }

  async findListById(user: UserEntity): Promise<ResponseInterface> {
    return {
      statusCode: HttpStatus.OK,
      data: {},
    };
  }

  async findOneByRoomName(roomName: string): Promise<ResponseInterface> {
    const room = await this.roomRepository.find({ roomName });
    if (!room) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: '房间不存在',
      };
    }
    return {
      statusCode: HttpStatus.OK,
    };
  }

  async create(roomId: string): Promise<ResponseInterface> {
    const room = await this.roomRepository.findOne({ roomId });
    if (room) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: '房间已存在',
      };
    }
    const newRoom = new RoomEntity();
    newRoom.roomId = roomId;
    newRoom.roomName = roomId;
    await this.roomRepository.save(newRoom);
    return {
      statusCode: HttpStatus.OK,
      data: {
        msg: '创建房间成功',
      },
    };
  }

  async join(roomId: string): Promise<ResponseInterface> {
    const room = this.roomRepository.find({ roomId });
    if (!room) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: '房间不存在',
      };
    }
  }

  async leave(roomId: string) {
    return await this.roomRepository.delete({ roomId });
  }
}
