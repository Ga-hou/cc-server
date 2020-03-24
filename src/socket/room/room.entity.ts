import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { SocketRoomEntity } from './relations/SocketRoom.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  public id: number;

  @Column({
    name: 'room_id',
    type: 'varchar',
  })
  roomId: string;

  @Column({
    name: 'room_name',
    nullable: false,
  })
  roomName: string;

  @ManyToOne(
    () => SocketRoomEntity,
    socketRooms => socketRooms.rooms,
  )
  roomSocket!: SocketRoomEntity[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    comment: '创建时间',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'modify_date',
    comment: '更新时间',
  })
  modifyDate: Date;
}
