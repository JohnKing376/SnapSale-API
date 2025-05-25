import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractModel } from '../../common/models/abstract-model.entity';
import CartItem from '../cart-item/entities/cart-item.entity';
import User from '../../users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('cart')
export default class Cart extends AbstractModel {
  @Exclude()
  @Column()
  userId: number;

  @Column({
    nullable: true,
    default: 0,
  })
  totalPrice: number;

  @OneToMany(() => CartItem, (items) => items.cart, {
    eager: true,
    cascade: ['remove'],
  })
  items: CartItem[];

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;
}
