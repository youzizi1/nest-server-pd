import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Query,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CodesService } from './codes.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CodeDto } from './dtos/code.dto';
import { User } from '../users/user.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Permissions } from 'src/decorators/permissions.interceptor';
import { Resource } from 'src/enums/resource.enum';
import { Possession } from 'src/enums/possession.enum';
import { AccessGuard } from '../../guards/access.guard';

@Controller('codes')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('代码片段模块')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '创建代码片段' })
  async createCode(@Body() data: CodeDto, @GetUser() user: User) {
    return await this.codesService.createCode(data, user);
  }

  @Get()
  @ApiOperation({ summary: '获取代码片段' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async findCodes(
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sort') sort: string,
  ) {
    return await this.codesService.findCodes(
      search,
      category,
      page,
      limit,
      sort,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AccessGuard)
  @Permissions({ resource: Resource.CODES, possession: Possession.OWN })
  @ApiOperation({ summary: '更新代码片段' })
  async updateCode(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CodeDto,
  ) {
    return await this.codesService.updateCode(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AccessGuard)
  @Permissions({ resource: Resource.CODES, possession: Possession.OWN })
  @ApiOperation({ summary: '删除指定id的代码片段' })
  async deleteCode(@Param('id', ParseIntPipe) id: number) {
    return await this.codesService.deleteCode(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '查找指定id的代码片段' })
  async findCodeById(@Param('id', ParseIntPipe) id: number) {
    return await this.codesService.findCodeById(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '点赞指定id的代码片段' })
  async userLikeCode(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.codesService.userLikeCode(id, user);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '取消点赞指定id的代码片段' })
  async userUnlikeCode(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.codesService.userUnlikeCode(id, user);
  }

  @Get(':id/liked')
  @ApiOperation({ summary: '获取点赞指定id的代码片段的用户列表' })
  async findLikedUsers(@Param('id', ParseIntPipe) id: number) {
    return await this.codesService.findLikedUsers(id);
  }
}
