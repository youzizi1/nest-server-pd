import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentDto {
  @ApiProperty({ description: '评论标题' })
  @IsNotEmpty({ message: '评论标题不能为空' })
  title: string;

  @ApiProperty({ description: '评论内容' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  content: string;
}
