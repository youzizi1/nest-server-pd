import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  name: string;

  @ApiProperty({ description: '分类别名' })
  alias: string;

  @ApiProperty({ description: '分类颜色' })
  color: string;
}
