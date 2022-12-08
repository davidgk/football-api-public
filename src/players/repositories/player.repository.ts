import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Player } from '@players/models/entities/player.entity';
import { Team } from '@teams/models/entities/team.entity';
import { PLAYER_ERRORS } from '@config/constants';
import { findCompetition } from '@commons/repositories/competition-cd.repository';
import {
  CoachInterface,
  PlayerInterface,
} from '@players/models/interfaces/player.interfaces';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async buildAndSave(
    player: CoachInterface,
    team: Team,
    isCoach = false,
    entityManager?: EntityManager,
  ): Promise<Player> {
    const playerToSave = new Player();
    playerToSave.name = player.name;
    playerToSave.isCoach = isCoach;
    playerToSave.dateOfBirth = player.dateOfBirth;
    playerToSave.nationality = player.nationality;
    playerToSave.team = team;
    if (isCoach) {
      return this.save(playerToSave, entityManager);
    }
    playerToSave.position = (player as PlayerInterface).position;
    return this.save(playerToSave, entityManager);
  }

  async save(player: Player, entityManager: EntityManager): Promise<Player> {
    if (entityManager) {
      return entityManager.save<Player>(player);
    }
    return this.playerRepository.save(player);
  }

  findPlayersByLeagueCodeAndTeam(
    code: string,
    teamName: string,
    shouldBeCoach = false,
  ): Promise<Player[]> {
    const query = this.playerRepository
      .createQueryBuilder('player')
      .innerJoinAndSelect('player.team', 'team')
      .innerJoinAndSelect('team.competition', 'competition')
      .where('player.deletedAt is NULL')
      .andWhere('competition.code = :code', { code })
      .andWhere('player.isCoach = :shouldBeCoach', { shouldBeCoach });
    if (teamName) {
      query.andWhere('team.name = :name', { name: teamName });
    }
    return query.getMany();
  }

  getEntityManagerForTransactions(): EntityManager {
    return this.playerRepository.manager;
  }

  async findCompetitionOrFail(code: string) {
    const entityManager = this.playerRepository.manager;
    const competition = await findCompetition(code, entityManager);
    if (!competition) throw new Error(PLAYER_ERRORS.COMPETITION_NULL);
    return competition;
  }
}
