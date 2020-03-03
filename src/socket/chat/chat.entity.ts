import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text', {
    nullable: false
  })
  message: string;


}
