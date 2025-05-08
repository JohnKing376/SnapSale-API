import { AbstractModel } from '../../common/models/abstract-model.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import User from '../../users/entities/user.entity';
import { OtpTokenType } from '../enums/otp-token-type.enums';

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
  isUsed: boolean;

  @Column({
    type: 'enum',
    enum: OtpTokenType,
    nullable: true,
  })
  purpose: OtpTokenType;

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
