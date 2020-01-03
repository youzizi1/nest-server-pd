import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoryDto } from './dtos/category.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
@ApiTags('分类模块')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '创建分类' })
  async createCategory(@Body() data: CategoryDto) {
    return await this.categoriesService.createCategory(data);
  }
}
