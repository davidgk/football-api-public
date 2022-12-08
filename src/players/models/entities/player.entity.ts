import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DB_PUBLIC_SCHEMA, DB_TABLE_NAMES } from '@config/constants';
import { AbstractModelEntity } from '@commons/models/abstract-model.entity';
import { Team } from '@teams/models/entities/team.entity';

@ObjectType()
@Entity(DB_TABLE_NAMES.PLAYERS, DB_PUBLIC_SCHEMA)
export class Player extends AbstractModelEntity {
  @Field(() => String)
  @Column({ name: 'name', length: 200, nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'position', length: 20, nullable: true })
  position: string;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Field(() => String, { nullable: true })
  @Column({ name: 'nationality', length: 50, nullable: true })
  nationality: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ name: 'is_coach', default: false })
  isCoach: boolean;

  @Field(() => Team)
  @ManyToOne(() => Team, (team) => team.players, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'id_team', referencedColumnName: 'id' })
  team: Team;
}
