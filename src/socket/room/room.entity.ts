import {
  Entity,
  ManyToMany,
  JoinTable,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../system/user/user.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'room_id',
  })
  roomId: number;

  @ManyToMany(
    () => UserEntity,
    user => user.userRooms,
  )
  @JoinTable({
    name: 'user_room',
  })
  roomUsers!: UserEntity;

  @Column({
    name: 'room_name',
    nullable: false,
  })
  roomName: string;

  // @Column({
  //   name: 'room_type',
  //   enum: ['private', 'publish'],
  //   default: 'publish',
  // })
  // roomType: string;

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