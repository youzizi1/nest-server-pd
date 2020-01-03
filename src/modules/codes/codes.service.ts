import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code } from './code.entity';
import { Repository } from 'typeorm';
import { CodeDto } from './dtos/code.dto';
import { User } from '../users/user.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly codesRepo: Repository<Code>,
    private readonly categoriesService: CategoriesService,
  ) {}

  /**
   * 创建代码片段
   * @param data 代码片段数据
   * @param user 用户数据
   */
  async createCode(data: CodeDto, user: User) {
    const category = await this.categoriesService.findCategoryByName(
      data.category.name,
    );
    const entity = await this.codesRepo.create(data);
    entity.category = category;
    await this.codesRepo.save({
      ...entity,
      user,
    });
    return entity;
  }

  /**
   * 删除指定id的代码片段
   * @param id 代码id
   */
  async deleteCode(id: number) {
    return await this.codesRepo.delete(id);
  }

  /**
   * 查询代码片段
   * @param category 分类
   * @param page 页码
   * @param limit 页数
   * @param sort 排序
   */
  async findCodes(
    search: string,
    category: string,
    page: string = '1',
    limit: string = '10',
    sort: string = 'created',
  ) {
    const queryBuilder = await this.codesRepo
      .createQueryBuilder('code')
      .leftJoinAndSelect('code.user', 'user')
      .leftJoinAndSelect('code.category', 'category');

    if (search) {
      queryBuilder.where('code.content LIKE :param').setParameters({
        param: `%${search}%`,
      });
    }

    if (category) {
      queryBuilder.where('category.name = :name', { name: category });
    }
    const intLimit = Number(limit);
    const intPage = Number(page);

    queryBuilder.take(intLimit).skip(intLimit * (intPage - 1));

    queryBuilder.orderBy({
      [`code.${sort}`]: 'DESC',
    });

    const entities = queryBuilder.getManyAndCount();
    return entities;
  }

  /**
   * 更新代码片段
   * @param id 代码片段id
   * @param data 代码片段数据
   */
  async updateCode(id: number, data: CodeDto) {
    const entity = await this.codesRepo.findOne(id);
    if (!entity) {
      throw new NotFoundException('该代码片段不存在');
    }

    return await this.codesRepo.save({
      ...entity,
      ...data,
    });
  }

  /**
   * 查找指定id的代码片段
   * @param id 代码片段id
   */
  async findCodeById(id: number) {
    return await this.codesRepo.findOne(id);
  }

  /**
   * 点赞指定id的代码片段
   * @param id 代码片段id
   * @param user 用户数据
   */
  async userLikeCode(id: number, user: User) {
    return await this.codesRepo
      .createQueryBuilder()
      .relation(User, 'likes')
      .of(user)
      .add(id);
  }

  /**
   * 取消点赞指定id的代码片段
   * @param id 代码片段id
   * @param user 用户数据
   */
  async userUnlikeCode(id: number, user: User) {
    return await this.codesRepo
      .createQueryBuilder()
      .relation(User, 'likes')
      .of(user)
      .remove({ id });
  }

  /**
   * 获取点赞指定id的代码片段的用户列表
   * @param id 代码片段id
   */
  async findLikedUsers(id: number) {
    return await this.codesRepo
      .createQueryBuilder()
      .relation(Code, 'liked')
      .of(id)
      .loadMany();
  }
}
