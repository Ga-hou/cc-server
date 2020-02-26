import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoleDto {
  @IsNumber()
  @IsNotEmpty({ message: '角色 ID 不能为空' })
  readonly roleId: number;

  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  readonly roleName: string;

  @IsString({ message: '不是有效数据' })
  readonly remark: string;
}
