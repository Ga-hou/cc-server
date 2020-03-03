import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'

@Entity('role')
export class RolesEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'role_name',
  })
  public roleName: string;

  @Column({
    comment: '角色备注',
  })
  public remark: string;

  @CreateDateColumn()
  createDate: Date;

  @OneToMany(
    () => UserRoleEntity,
    userRole => userRole.roles,
  )
  public userRoles: UserRoleEntity[]
}
