import {
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少需要三位' })
  readonly username: string;

  @IsString({ message: '密码不是有效的数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsString({ message: '确认密码不是有效数据' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string;

}
