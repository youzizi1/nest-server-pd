import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/modules/users/user.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('用户模块')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async createUser(@Body() data: UserDto) {
    return await this.usersService.createUser(data);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询指定id的用户' })
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findUserById(id);
  }

  @Put(':id/password')
  @ApiOperation({ summary: '更新密码' })
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, data);
  }

  @Delete('id')
  @ApiOperation({ summary: '删除指定id的用户' })
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUserById(id);
  }

  @Get(':id/likes')
  @ApiOperation({ summary: '获取指定id的用户点赞的代码片段' })
  async findCodesLikedUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findCodesLikedUser(id);
  }

  @Get(':id/possess/:resource/:resourceId')
  @ApiOperation({ summary: '用户是否拥有某个资源' })
  async userPossessResource(
    @Param('id', ParseIntPipe) id: number,
    @Param('resource') resource: string,
    @Param('resourceId') resourceId: number,
  ) {
    return await this.usersService.userPossessResource(
      id,
      resource,
      resourceId,
    );
  }

  @Post('follow/:id')
  @ApiOperation({ summary: '关注某人' })
  async followUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.usersService.followUser(id, user);
  }

  @Delete('follow/:id')
  @ApiOperation({ summary: '取消关注某人' })
  async unfollowUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.usersService.unfollowUser(id, user);
  }

  @Get(':id/following')
  @ApiOperation({ summary: '查询指定id的用户的关注列表' })
  async findFollowing(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findFollowing(id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: '查询指定id的用户的被关注列表' })
  async findFollowers(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findFollowers(id);
  }
}
