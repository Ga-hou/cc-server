import { IsNotEmpty, IsNumber, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseMessageDto } from '../baseMessage';

class LoginPayloadDto {
  @IsNumber({}, { message: 'id格式不正确' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;
}

export class LoginDto extends BaseMessageDto {
  @ValidateNested({
    each: true,
  })
  @Type(() => LoginPayloadDto)
  payload: LoginPayloadDto;
}
