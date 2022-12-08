import { ObjectType, Field } from '@nestjs/graphql';
import { AbstractModelEntity } from '@commons/models/abstract-model.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Competition } from '@competitions/models/entities/competition.entity';
import { Player } from '@players/models/entities/player.entity';
import { DB_PUBLIC_SCHEMA, DB_TABLE_NAMES } from '@config/constants';
import { TeamExpectedInterface } from '@teams/models/interfaces/TeamInterfaces';
import { IsOptional } from 'class-validator';

@ObjectType()
@Entity(DB_TABLE_NAMES.TEAMS, DB_PUBLIC_SCHEMA)
export class Team extends AbstractModelEntity {
  @Field(() => String)
  @Column({ name: 'name', length: 50, nullable: false })
  name: string;

  @Field(() => String)
  @Column({ name: 'tla', length: 5, nullable: false })
  tla: string;

  @Field(() => String)
  @Column({ name: 'short_name', length: 30, nullable: false })
  shortName: string;

  @Field(() => String)
  @Column({ name: 'area_name', length: 20, nullable: false })
  areaName: string;

  @Field(() => String)
  @Column({ name: 'address', length: 200, nullable: false })
  address: string;

  @Field(() => Competition)
  @ManyToOne(() => Competition, (competition) => competition.teams, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'id_competition', referencedColumnName: 'id' })
  competition: Competition;

  @Field(() => [Player], { nullable: 'items' })
  @OneToMany(() => Player, (player) => player.team, {
    eager: true,
    cascade: true,
  })
  players: Player[];

  @Field(() => [Player], { nullable: 'items' })
  @IsOptional()
  coaches: Player[];

  static createTeamFromData(
    aTeamData: TeamExpectedInterface,
    competition: Competition,
  ): Team {
    const aTeam = new Team();
    aTeam.name = aTeamData.name;
    aTeam.shortName = aTeamData.shortName;
    aTeam.tla = aTeamData.tla;
    aTeam.areaName = aTeamData.area.name;
    aTeam.address = aTeamData.address;
    aTeam.competition = competition;
    return aTeam;
  }
}
