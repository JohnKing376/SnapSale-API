import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractModel } from '../../common/models/abstract-model.entity';
import Order from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export default class OrderItem extends AbstractModel {
  @Column({
    type: 'int',
  })
  quantity: number;

  @Column()
  price: number;

  @Exclude()
  @Column()
  productId: number;

  @Exclude()
  @Column()
  orderId: number;

  @ManyToOne(() => Product, {
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
