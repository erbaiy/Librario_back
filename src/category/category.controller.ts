import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: Partial<Category>): Promise<Category> {
    try {
      return await this.categoryService.create(data);
    } catch (error) {
      throw new HttpException('Failed to create category', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch categories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    try {
      const category = await this.categoryService.findOne(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw new HttpException('Failed to fetch category', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Category>): Promise<Category> {
    try {
      const category = await this.categoryService.update(id, data);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw new HttpException('Failed to update category', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.categoryService.delete(id);
    } catch (error) {
      throw new HttpException('Failed to delete category', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
