import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Generated,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('group')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'group_name',
  })
  public groupName: string;

  @Column({
    name: 'group_id',
  })
  @Generated('uuid')
  public groupId: string;

  @ManyToMany(
    () => UserEntity,
    user => user.userGroup,
    {
      cascade: true,
    },
  )
  @JoinTable({
    name: 'user_group',
  })
  user: UserEntity[];
}
