import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity';
import { RoomEntity } from '../../socket/room/room.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column()
  public password: string;

  @Column({
    name: 'user_name',
    nullable: false
  })
  public username: string;


  // 角色关系
  @OneToMany(
    () => UserRoleEntity, // 返回我们想要与之建立关系的实体的类
    userRoles => userRoles.users, // 表明在一对多关系中
    { cascade: ['insert', 'remove'], nullable: false },
  )
  public userRoles!: UserRoleEntity[];

  @ManyToMany(
    () => RoomEntity,
    room => room.roomUsers,
    {
      cascade: true,
    },
  )
  public userRooms!: RoomEntity[];

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
