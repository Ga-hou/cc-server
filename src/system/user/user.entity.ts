import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { GroupEntity } from '../group/group.entity';
import { SocketEntity } from '../../socket/socket.entity';

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
    () => GroupEntity,
    group => group.user,
  )
  public userGroup!: GroupEntity[];

  @OneToOne(
    () => SocketEntity,
    socket => socket.user,
    {
      cascade: true,
    },
  )
  socket: SocketEntity;

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
