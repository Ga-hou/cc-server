import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  readonly roleName: string;

  @IsString({ message: '不是有效数据' })
  readonly remark: string;
}
