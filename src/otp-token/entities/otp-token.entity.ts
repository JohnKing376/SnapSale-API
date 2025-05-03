import { AbstractModel } from '../../common/models/abstract-model.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity({ name: 'otp_token' })
export default class OtpToken extends AbstractModel {
  @Column({
    type: 'int',
    nullable: false,
  })
  token: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRevoked: boolean;

  @Column({
    type: 'varchar',
  })
  purpose: string;

  @Column()
  userId: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expiresAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
