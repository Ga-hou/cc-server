import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsNumber({}, { message: '不是有效的数据' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly id: number;

  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly account: string;

  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '姓名不能为空' })
  readonly username: string;

  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '用户类型不能为空' })
  readonly roleId: 1 | 2 | 3;

  @IsArray({ message: '不是有效的数据' })
  readonly groupIdList: Array<string>;
}
