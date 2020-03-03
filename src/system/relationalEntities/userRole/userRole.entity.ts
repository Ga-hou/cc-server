import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { RolesEntity } from '../../roles/roles.entity';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'role_id' })
  roleId!: number;

  @ManyToOne(
    () => UserEntity,
    user => user.userRoles,
  )
  @JoinColumn({ name: 'user_id' }) // 表明实体键的对应关系。关系可以是单向的或双向的。但是只有一方可以拥有。在关系的所有者方需要使用 @JoinColumn 装饰器。
  users!: UserEntity;

  @ManyToOne(
    () => RolesEntity,
    role => role.userRoles,
  )
  @JoinColumn({ name: 'role_id' })
  roles!: RolesEntity;
}
