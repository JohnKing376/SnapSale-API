import { Entity, Column, BeforeInsert } from 'typeorm';
import { DateTime } from 'luxon';
import { createId } from '@paralleldrive/cuid2';

@Entity()
export class AbstractModel {
  @Column({
    type: 'varchar',
    unique: true,
  })
  identifier: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  createdAt: DateTime;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: DateTime;

  @BeforeInsert()
  generateIdentifier() {
    this.identifier = createId();
  }
}
