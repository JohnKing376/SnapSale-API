import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import Category from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private readonly logger = new Logger('CategoryService');

  async onModuleInit() {
    await this.seedDefaultCategories();
  }

  private async seedDefaultCategories() {
    const defaultCategories = await this.categoryRepository.count();

    const categories = [
      'Electronics',
      'Fashion',
      'Home & Living',
      'Books',
      'Groceries',
      'Beauty & Health',
      'Toys & Games',
      'Sports',
      'Automotive',
      'Pets',
    ];

    if (defaultCategories === 0) {
      const category = categories.map((name) =>
        this.categoryRepository.create({ name }),
      );

      await this.categoryRepository.save(category);

      this.logger.log(`Seeded default categories`);
    }
  }

  public async listCategories() {
    const categories = await this.categoryRepository.find();

    if (!categories) {
      throw new NotFoundException('categories not found');
    }

    return categories;
  }
}
