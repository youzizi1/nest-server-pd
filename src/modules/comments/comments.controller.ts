import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
  Body,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CommentDto } from './dtos/comment.dto';
import { User } from 'src/modules/users/user.entity';
import { AccessGuard } from '../../guards/access.guard';
import { Resource } from '../../enums/resource.enum';
import { Possession } from '../../enums/possession.enum';
import { Permissions } from 'src/decorators/permissions.interceptor';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('评论模块')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('codes/:id')
  @ApiOperation({ summary: '创建评论' })
  async createComment(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    data: CommentDto,
    @GetUser()
    user: User,
  ) {
    return await this.commentsService.createComment(id, user, data);
  }

  @Put(':id')
  @UseGuards(AccessGuard)
  @Permissions({ resource: Resource.COMMENTS, possession: Possession.OWN })
  @ApiOperation({ summary: '更新指定id的评论' })
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CommentDto,
  ) {
    return await this.commentsService.updateComment(id, data);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @Permissions({ resource: Resource.COMMENTS, possession: Possession.OWN })
  @ApiOperation({ summary: '删除指定id的评论' })
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.deleteComment(id);
  }

  @Get('codes/:id')
  @ApiOperation({ summary: '获取指定id的代码片段的评论列表' })
  async findCodeComments(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.findCodeComments(id);
  }

  @Get('users/:id')
  @ApiOperation({ summary: '获取指定id的用户的评论列表' })
  async findUserComments(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.findUserComments(id);
  }
}
