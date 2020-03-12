import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RoomEntity } from '../../socket/room/room.entity';
import { GroupEntity } from '../group/group.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'role_id',
    nullable: false,
  })
  public roleId: number;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column()
  public password: string;

  @Column({
    name: 'account',
    nullable: false,
  })
  public account: string;

  @Column({
    name: 'username',
    nullable: false,
  })
  public username: string;

  @ManyToMany(
    () => RoomEntity,
    room => room.roomUsers,
    {
      cascade: true,
    },
  )
  public userRooms!: RoomEntity[];

  @ManyToMany(
    () => GroupEntity,
    group => group.user,
  )
  public userGroup!: GroupEntity[];

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    comment: '创建时间',
  })
  createDate: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'modify_date',
    comment: '更新时间',
  })
  modifyDate: Date;
}
