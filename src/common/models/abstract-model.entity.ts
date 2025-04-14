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
  })
  createdAt: DateTime;

  @Column({
    type: 'timestamp',
  })
  updatedAt: DateTime;

  @BeforeInsert()
  public static generateIdentifier(model: AbstractModel) {
    model.identifier = createId();
  }
}
