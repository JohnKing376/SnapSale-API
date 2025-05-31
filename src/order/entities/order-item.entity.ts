import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractModel } from '../../common/models/abstract-model.entity';
import Order from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export default class OrderItem extends AbstractModel {
  @Column({
    type: 'int',
  })
  quantity: number;

  @Column()
  price: number;

  @Column()
  productId: number;

  @Column()
  orderId: number;

  @ManyToOne(() => Product, {
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
