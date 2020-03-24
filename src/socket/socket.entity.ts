import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../system/user/user.entity';
import { SocketRoomEntity } from './room/relations/SocketRoom.entity';

@Entity('socket')
export class SocketEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'user_id',
  })
  public userId: number;

  @Column({
    name: 'client_id',
    nullable: true,
  })
  public clientId: string;

  @Column({
    name: 'online',
  })
  public online: boolean;

  @OneToOne(
    () => UserEntity,
    user => user.socket,
  )
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @OneToMany(
    () => SocketRoomEntity,
    socketRoom => socketRoom.socket,
  )
  socketRooms: SocketRoomEntity[];
}
