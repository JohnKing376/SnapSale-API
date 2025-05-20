import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractModel } from '../../common/models/abstract-model.entity';
import User from '../../users/entities/user.entity';
import { ProductCondition } from '../enums/product-condition.enum';
import { Exclude } from 'class-transformer';
import Category from '../../category/entities/category.entity';

@Entity()
export class Product extends AbstractModel {
  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  isAvailable: boolean;

  @Column({
    enum: ProductCondition,
    type: 'enum',
  })
  condition: ProductCondition;

  @Column()
  region: string;

  @Column('json', { nullable: true })
  productImages?: string[];

  @Exclude()
  @Column()
  merchantId: number | null;

  @Column()
  categoryId: number;

  @ManyToOne(() => User, (user) => user.products)
  merchant: User;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
