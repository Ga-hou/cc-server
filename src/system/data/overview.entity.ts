import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('data_overview')
export class OverviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_time',
  })
  private createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'modify_time',
  })
  private modifyTime: Date;

  @Column({
    name: 'duration',
  })
  public duration: number;

  @Column({
    name: 'avg_duration',
  })
  public avgDuration: number;

  @Column({
    name: 'count',
  })
  public count: number;

  @Column({
    name: 'avg_count',
  })
  public avgCount: number;

  @Column({
    name: 'trend',
    default: Array.from({ length: 24 }).map(() => 0).join(','),
  })
  public trend: string;
}
