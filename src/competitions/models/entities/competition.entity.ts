import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModelEntity } from '@commons/models/abstract-model.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Team } from '@teams/models/entities/team.entity';
import { DB_PUBLIC_SCHEMA, DB_TABLE_NAMES } from '@config/constants';

@ObjectType()
@Entity(DB_TABLE_NAMES.COMPETITIONS, DB_PUBLIC_SCHEMA)
export class Competition extends AbstractModelEntity {
  static buildCompetitionFromData(data: any) {
    const name = data.name;
    const areaName = data.area.name;
    const code = data.code;
    return new Competition(name, areaName, code);
  }

  constructor(name: string, areaName: string, code: string) {
    super();
    this.name = name;
    this.areaName = areaName;
    this.code = code;
  }

  @Field(() => String)
  @Column({ name: 'name', length: 40, nullable: false })
  name: string;

  @Field(() => String)
  @Column({ name: 'area_name', length: 20, nullable: false })
  areaName: string;

  @Field(() => String)
  @Column({ name: 'code', length: 2, nullable: false })
  code: string;

  @OneToMany(() => Team, (team) => team.competition, {
    eager: true,
    cascade: true,
  })
  teams: Team[];
}
