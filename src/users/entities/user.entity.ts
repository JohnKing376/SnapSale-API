import {AbstractModel} from 'src/common/models/abstract-model.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity({
  name: 'users'
})
export default class User extends AbstractModel {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;


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
    length: 11,
  })
  mobileNumber: string;

  @Column({
    type: 'varchar',
    length: 99,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,  
  })
  password: string

  @Column({
    type: 'enum',
    nullable: false,
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profileImg?: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  googleId?: string
}
