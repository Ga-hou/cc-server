import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class BaseMessageDto {
  @IsString()
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;

  @IsNotEmpty({
    message: '时间戳不能为空',
  })
  timestamp: number;

  @IsIn(['in', 'out'])
  @IsNotEmpty({
    message: 'flow不能为空',
  })
  flow: string;

  @IsString({
    message: 'from格式不正确',
  })
  @IsNotEmpty({
    message: 'from不能为空',
  })
  from: string;

  @IsString({ message: 'role格式不正确' })
  @IsNotEmpty({ message: 'role不能为空' })
  role: 'agent' | 'user'
}
