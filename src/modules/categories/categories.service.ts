import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  /**
   * 创建分类
   * @param data 分类数据
   */
  async createCategory(data: CategoryDto) {
    const entity = await this.categoriesRepo.create(data);
    return await this.categoriesRepo.save(entity);
  }

  /**
   * 查询指定分类名的分类
   * @param name 分类名
   */
  async findCategoryByName(name: string) {
    const entity = await this.categoriesRepo.findOne({ name });
    if (!entity) {
      throw new NotFoundException('该分类不存在');
    }
    return entity;
  }
}
