import { BaseMessageDto } from './baseMessage';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SystemMessagePayloadDto {
  @IsNumber({}, { message: 'type格式不正确' })
  @IsNotEmpty({ message: 'type不能为空' })
  type: number;

  data: any;
}

export class SystemMessageDto extends BaseMessageDto {
  @ValidateNested()
  @Type(() => SystemMessagePayloadDto)
  payload: SystemMessagePayloadDto;
}
