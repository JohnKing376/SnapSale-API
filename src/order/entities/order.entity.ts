import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractModel } from '../../common/models/abstract-model.entity';
import User from '../../users/entities/user.entity';
import OrderItem from './order-item.entity';

@Entity()
export default class Order extends AbstractModel {
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    eager: true,
  })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ default: 'pending' })
  status: string;
}
