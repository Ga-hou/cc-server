import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../system/user/user.entity';
import { RoomEntity } from './room/room.entity';

@Entity('socket')
export class SocketEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  public userId: number;

  @Column({
    name: 'status',
    nullable: true,
  })
  public status: string;

  @Column({
    name: 'client_id',
    nullable: true,
  })
  public clientId: string;

  @OneToOne(
    () => UserEntity,
    user => user.socket,
  )
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @ManyToMany(
    () => RoomEntity,
    room => room.roomUsers,
    {
      cascade: true,
    },
  )
  public rooms!: RoomEntity[];
}
