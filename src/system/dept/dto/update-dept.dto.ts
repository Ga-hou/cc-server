import { IsNumber, IsString, IsNotEmpty, IsBoolean } from 'class-validator'

export class UpdateDeptDto {
  @IsNumber()
  @IsNotEmpty({ message: '部门Id 不能为空' })
  readonly deptId: number

  @IsNumber()
  readonly parentId: number

  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  readonly name: string

  @IsNumber()
  readonly orderNum: number

  @IsBoolean()
  readonly delFlag: boolean
}
