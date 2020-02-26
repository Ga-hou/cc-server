import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column()
  public password: string;

  @Column()
  public username: string;

  // 角色关系
  @OneToMany(
    type => UserRoleEntity,
    userRoles => userRoles.users,
    { cascade: ['insert', 'remove'], nullable: false },
  )
  public userRoles!: UserRoleEntity[]

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
