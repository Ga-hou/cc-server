import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

export class LoginUserDto {
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsEmail()
  readonly username: string

  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string
}
