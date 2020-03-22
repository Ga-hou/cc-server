import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../system/user/user.entity';
import { Repository } from 'typeorm';
import { SocketEntity } from './socket.entity';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(SocketEntity)
    private readonly socketRepository: Repository<SocketEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async login(userId: number, clientId: string) {
    let socket = await this.socketRepository.findOne({
      userId,
    });
    if (!socket) {
      socket = new SocketEntity();
      socket.status = 'online';
      socket.clientId = clientId;
    } else {
      socket.clientId = clientId;
      socket.status = 'online';
    }
    return await this.socketRepository.save(socket);
  }

  async logout(clientId: string) {
    return await this.socketRepository.update(
      {
        clientId,
      },
      {
        status: 'offline',
        clientId: '',
      },
    );
  }

  async findRooms(clientId: string) {
    const socket = await this.socketRepository.findOne(
      {
        clientId,
      },
      {
        relations: ['rooms'],
      },
    );
    console.log(socket);
    return socket ? socket.rooms : [];
  }
}
