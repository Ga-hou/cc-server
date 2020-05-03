import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SocketEntity } from '../../socket.entity';
import { RoomEntity } from '../room.entity';

@Entity('socket_room')
export class SocketRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'room_id',
  })
  public roomId: string;

  @Column({
    name: 'client_id',
  })
  clientId: string;

  @Column({
    name: 'status',
  })
  public status: string;

  @ManyToOne(
    () => SocketEntity,
    socket => socket.socketRooms
  )
  @JoinColumn({
    name: 'client_id',
  })
  socket: SocketEntity;

  @OneToMany(
    () => RoomEntity,
    room => room.roomSocket,
    {
      cascade: true,
    },
  )
  @JoinColumn({
    name: 'room_id',
  })
  rooms: RoomEntity[];
}
