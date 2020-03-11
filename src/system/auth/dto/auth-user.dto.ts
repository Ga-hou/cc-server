import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

export class AuthUserDTO {
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '账号不能为空' })
  @IsEmail()
  readonly account: string

  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string
}
