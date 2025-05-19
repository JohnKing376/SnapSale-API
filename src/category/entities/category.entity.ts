import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { AbstractModel } from '../../common/models/abstract-model.entity';

@Entity()
export default class Category extends AbstractModel {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
