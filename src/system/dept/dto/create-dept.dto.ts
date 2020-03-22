import { IsNumber, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateDeptDto {
  @IsNumber()
  readonly parentId: number;

  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  readonly name: string;

  @IsNumber()
  readonly orderNum: number;

  @IsBoolean()
  readonly delFlag: boolean;
}
