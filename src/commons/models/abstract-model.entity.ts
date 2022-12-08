import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field } from '@nestjs/graphql';

export abstract class AbstractModelEntity {
  @Field(() => String, { description: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Date, { description: 'created at' })
  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    default: () => "timezone('utc', now())",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    default: () => "timezone('utc', now())",
  })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: false })
  deletedAt!: Date;
}
