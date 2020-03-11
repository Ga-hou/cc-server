import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly account: string;

  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '姓名不能为空' })
  readonly username: string;

  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '用户类型不能为空' })
  readonly roleId: 1 | 2 | 3;
  //
  // @IsString({ message: '确认密码不是有效数据' })
  // @IsNotEmpty({ message: '确认密码不能为空' })
  // confirmPassword: string;
}
