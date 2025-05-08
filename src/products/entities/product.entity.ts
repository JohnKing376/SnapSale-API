import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractModel } from '../../common/models/abstract-model.entity';
import User from '../../users/entities/user.entity';
import { ProductCondition } from '../enums/product-condition.enum';
import { ProductCategory } from '../enums/category.enum';

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
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory[];

  @Column({
    enum: ProductCondition,
    type: 'enum',
  })
  condition: ProductCondition;

  @Column()
  region: string;

  @Column('json', { nullable: true })
  productImages?: string[];

  @Column()
  merchantId: number | null;

  @ManyToOne(() => User, (user) => user.products)
  merchant: User;
}
