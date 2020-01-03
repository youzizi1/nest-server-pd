import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/category.entity';
import { IsNotEmpty } from 'class-validator';

export class CodeDto {
  @ApiProperty({ description: '代码片段标题' })
  @IsNotEmpty({ message: '代码片段标题不能为空' })
  title: string;

  @ApiProperty({ description: '代码片段内容' })
  @IsNotEmpty({ message: '代码片段内容不能为空' })
  content: string;

  @ApiProperty({ description: '代码片段分类' })
  @IsNotEmpty({ message: '代码片段分类不能为空' })
  category: Category;
}
