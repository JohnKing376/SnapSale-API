import { AbstractModel } from 'src/common/models/abstract-model.entity';
import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Exclude } from 'class-transformer';
import { RoleType } from '../../auth/enums/role-type.enums';
import Cart from '../../cart/entities/cart.entity';
import Order from '../../order/entities/order.entity';

@Entity({
  name: 'users',
})
export default class User extends AbstractModel {
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 14,
  })
  mobileNumber: string;

  @Column({
    type: 'varchar',
    length: 99,
    unique: true,
    nullable: false,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: RoleType,
    default: RoleType.CUSTOMER,
  })
  role: RoleType;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  profileImg?: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  googleId?: string;

  @OneToMany(() => Product, (product) => product.merchant)
  products: Product[];

  @Column({
    nullable: true,
  })
  fullName: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  generateFullName() {
    this.fullName = `${this.lastName} ${this.firstName}`;
  }

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({ nullable: true })
  customerCode: string;
}
