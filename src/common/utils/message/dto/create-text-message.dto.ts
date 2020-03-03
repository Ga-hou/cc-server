import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextMessageDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  text: string;
}
