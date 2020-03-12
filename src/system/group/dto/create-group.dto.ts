import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '组名称不能为空' })
  readonly groupName: string;

  @IsArray({ message: '不是有效的数据' })
  readonly userIdList: Array<number>;
}
