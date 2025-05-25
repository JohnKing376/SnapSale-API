import { Column, Entity, ManyToOne } from 'typeorm';
import Cart from '../../entities/cart.entity';
import { AbstractModel } from '../../../common/models/abstract-model.entity';
import { Product } from '../../../products/entities/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export default class CartItem extends AbstractModel {
  @Exclude()
  @Column()
  productId: number;

  @Exclude()
  @Column()
  cartId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product, {
    eager: true,
  })
  product: Product;
}
