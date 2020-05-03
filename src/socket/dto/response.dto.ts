import { BaseMessageDto } from './baseMessage';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResponsePayloadDto {
  @IsNumber(
    {},
    {
      message: '状态码格式不正确',
    },
  )
  statusCode: number;
  @IsString({
    message: '错误信息格式不正确',
  })
  error?: string;

  data?: object;
}

export class ResponseDto extends BaseMessageDto {
  @ValidateNested({
    each: true,
  })
  @Type(() => ResponsePayloadDto)
  payload: ResponsePayloadDto;
}
