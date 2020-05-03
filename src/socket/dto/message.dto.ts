import { IsNotEmpty, IsNumber, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseMessageDto } from './baseMessage';

class MessagePayloadDto {
  @IsNotEmpty({ message: '消息内容不能为空' })
  text: string;
}

export class MessageDto extends BaseMessageDto {
  @ValidateNested({
    each: true,
  })
  @Type(() => MessagePayloadDto)
  payload: MessagePayloadDto;
}
