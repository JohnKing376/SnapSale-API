import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractModel } from '../../common/models/abstract-model.entity';
import { Statuses } from '../enums/statuses.enum';
import Order from '../../order/entities/order.entity';
import User from '../../users/entities/user.entity';

@Entity()
export class Delivery extends AbstractModel {
  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  phoneNumber: string;

  @Column()
  trackingIdentifier: string;

  @Column({ enum: Statuses, default: Statuses.PENDING })
  status: Statuses;

  @Column({ nullable: true })
  deliveryDate: Date;

  @Column()
  orderId: number;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.delivery)
  user: User;
}
