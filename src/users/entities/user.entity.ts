import { AbstractModel } from 'src/common/models/abstract-model.entity';
import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Exclude } from 'class-transformer';
import { RoleType } from '../../auth/enums/role-type.enums';

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

  @BeforeInsert()
  generateFullName() {
    this.fullName = this.lastName + ' ' + this.firstName;
  }
}
