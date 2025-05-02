import { AbstractModel } from '../../common/models/abstract-model.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import User from '../../users/entities/user.entity';
import { JoinColumn } from 'typeorm/browser';

@Entity({ name: 'otp_token' })
export class OtpToken extends AbstractModel {
  @Column({
    type: 'int',
    nullable: false,
  })
  token: number;

  @Column({
    type: 'boolean',
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
  })
  expiresAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
