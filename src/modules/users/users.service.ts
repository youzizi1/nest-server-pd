import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  /**
   * 查找指定用户名的用户
   * @param username 用户名
   */
  async findUserByUsername(username: string) {
    return await this.usersRepo.findOne({ username });
  }

  /**
   * 查找指定邮箱的用户
   * @param email 邮箱
   */
  async findUserByEmail(email: string) {
    return await this.usersRepo.findOne({ email });
  }

  /**
   * 查询指定id的用户
   * @param id 用户id
   */
  async findUserById(id: number) {
    const entity = await this.usersRepo.findOne(id);
    if (!entity) {
      throw new NotFoundException('该用户不存在');
    }
    return entity;
  }

  /**
   * 创建用户
   * @param data 用户数据
   */
  async createUser(data: UserDto) {
    if (await this.findUserByUsername(data.username)) {
      throw new BadRequestException('该用户名已经存在');
    }

    if (await this.findUserByEmail(data.email)) {
      throw new BadRequestException('该邮箱已经存在');
    }

    const entity = await this.usersRepo.create(data);
    await this.usersRepo.save(entity);
    return entity;
  }

  /**
   * 更新密码
   * @param id 用户id
   * @param data 密码数据
   */
  async updatePassword(id: number, data: UpdatePasswordDto) {
    const { password, newPassword } = data;
    const entity = await this.findUserById(id);
    if (!entity) {
      throw new NotFoundException('该用户不存在');
    }
    const passwordMatched = await entity.comparePassword(password);
    if (!passwordMatched) {
      throw new BadRequestException('密码错误');
    }

    entity.password = newPassword;
    return await this.usersRepo.save(entity);
  }

  /**
   * 删除指定id的用户
   * @param id 用户id
   */
  async deleteUserById(id: number) {
    if (!(await this.findUserById(id))) {
      throw new NotFoundException('该用户不存在');
    }

    return await this.usersRepo.delete(id);
  }

  /**
   * 获取指定id的用户点赞的代码片段
   * @param id 用户id
   */
  async findCodesLikedUser(id: number) {
    const entity = await this.usersRepo.findOne({
      relations: ['likes', 'likes.user'],
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException('该用户不存在');
    }
    return entity;
  }

  /**
   * 用户是否拥有某个资源
   * @param id 用户id
   * @param resource 资源名称
   * @param resourceId 资源id
   */
  async userPossessResource(id: number, resource: string, resourceId: number) {
    const result = await this.usersRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin(`user.${resource}`, resource)
      .andWhere(`${resource}.id = :resourceId`, { resourceId })
      .getCount();

    if (!result) {
      throw new NotFoundException('用户或资源不存在');
    }

    return result === 1 ? true : false;
  }

  /**
   * 关注某人
   * @param id 用户id
   * @param user 用户数据
   */
  async followUser(id: number, user: User) {
    return await this.usersRepo
      .createQueryBuilder()
      .relation(User, 'following')
      .of(user)
      .add(id);
  }

  /**
   * 取消关注某人
   * @param id 用户id
   * @param user 用户数据
   */
  async unfollowUser(id: number, user: User) {
    return await this.usersRepo
      .createQueryBuilder()
      .relation(User, 'following')
      .of(user)
      .remove({ id });
  }

  /**
   * 查询指定id的用户的关注列表
   * @param id 用户id
   */
  async findFollowing(id: number) {
    return await this.usersRepo
      .createQueryBuilder()
      .relation(User, 'following')
      .of(id)
      .loadMany();
  }

  /**
   * 查询指定id的用户的被关注列表
   * @param id 用户id
   */
  async findFollowers(id: number) {
    return await this.usersRepo
      .createQueryBuilder()
      .relation(User, 'followers')
      .of(id)
      .loadMany();
  }
}
