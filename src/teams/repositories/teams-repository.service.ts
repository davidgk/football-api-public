import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Team } from '@teams/models/entities/team.entity';

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async save(team: Team, entityManager: EntityManager) {
    if (entityManager) {
      return entityManager.save<Team>(team);
    }
    return this.teamRepository.save(team);
  }

  findByName(name: string) {
    return this.teamRepository.findOneOrFail({ where: { name } });
  }
}
