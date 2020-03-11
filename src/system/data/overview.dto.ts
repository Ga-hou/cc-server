import { IsDate, IsNotEmpty } from 'class-validator';

export class OverviewDto  {
  @IsDate()
  @IsNotEmpty()
  readonly date: Date
}