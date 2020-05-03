import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';
import { UserEntity } from '../../system/user/user.entity';
import { ResponseInterface } from '../../common/interfaces/response.interface';
import { Socket } from 'socket.io';
import { SocketServiceResponseDto } from '../dto/socket.service.response.dto';
@Injectable()
export class RoomService {
  private readonly logger = new Logger('roomService');
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

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

  /**
   * 创建房间
   * 首先判断谷歌服务是否存在这个房间，否则加入
   * 其次在room表查找，存在则抛错
   * 不然就创建
   * @param client 
   */
  async create(client: Socket): Promise<SocketServiceResponseDto> {
    const rooms = client.adapter.rooms[client.id];
    const roomId = client.id;
    let roomEntity;
    // google existing room
    if (rooms && rooms.length) {
      client.join(roomId);
    }
    try {
      roomEntity = await this.roomRepository.findOne({ roomId });
    } catch (e) {
      this.logger.error(e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'room service error',
      };
    }
    if (roomEntity) {
      this.logger.error(`房间${roomId}已存在`);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: '房间已存在',
      };
    }
    const newRoom = new RoomEntity();
    newRoom.roomId = roomId;
    newRoom.roomName = roomId;
    try {
      await this.roomRepository.save(newRoom);
      return {
        statusCode: HttpStatus.OK,
        data: {
          msg: '创建房间成功',
        },
      };
    } catch (e) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: '创建房间失败',
      };
    }
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

  async logout(roomId: string): Promise<SocketServiceResponseDto> {
    try {
      return {
        statusCode: 200,
        data: await this.roomRepository.delete({ roomId }),
      };
    } catch (e) {
      this.logger.error(e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: '退出失败',
      };
    }
  }
}
