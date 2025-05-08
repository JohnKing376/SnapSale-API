import { Column, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Exclude } from 'class-transformer';

// // TODO: Fix Date
// const dateTransformer = {
//   to(value: Date | null): Date | null {
//     return value;
//   },
//   from(value: Date | null): string | null {
//     return value ? DateTime.fromJSDate(value).setZone('utc').toISO() : null;
//   },
// };

export abstract class AbstractModel {
  @Exclude()
  @PrimaryGeneratedColumn('increment')
  declare id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  declare identifier: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    // transformer: dateTransformer,
  })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    // transformer: dateTransformer,
  })
  declare updatedAt: Date;

  @BeforeInsert()
  generateIdentifier() {
    this.identifier = createId();
  }
}
