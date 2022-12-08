import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Competition } from '@competitions/models/entities/competition.entity';
import { findCompetition } from '@commons/repositories/competition-cd.repository';

@Injectable()
export class CompetitionsRepository {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
  ) {}

  async save(competition: Competition): Promise<Competition> {
    return this.competitionRepository.save(competition);
  }

  async findCompetitionByCode(code: string): Promise<Competition> {
    return findCompetition(code, this.competitionRepository.manager);
  }

  getEntityManagerForTransactions(): EntityManager {
    return this.competitionRepository.manager;
  }
}
