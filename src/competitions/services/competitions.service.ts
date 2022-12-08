import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FootballApiService } from '@football-api/services/football-api.service';
import { Competition } from '@competitions/models/entities/competition.entity';
import { CompetitionsRepository } from '@competitions/repositories/competitions.repository';
import { TeamsService } from '@teams/services/teams.service';

@Injectable()
export class CompetitionsService {
  constructor(
    private footballApiService: FootballApiService,
    private competitionRepository: CompetitionsRepository,
    private teamsService: TeamsService,
  ) {}
  async create(code: string): Promise<Competition> {
    let response;
    try {
      let competition = await this.competitionRepository.findCompetitionByCode(
        code,
      );
      if (!competition) {
        response = await this.footballApiService.getLeagueByCode(code);
        competition = await this.processCompetition(response);
      }
      return competition;
    } catch (e) {
      throw new HttpException(
        'Something fail on recovering competitions:' + e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async processCompetition(response: {
    data: any;
  }): Promise<Competition> {
    const data = response.data;
    return this.competitionRepository
      .getEntityManagerForTransactions()
      .transaction(async (entityManager) => {
        const competitionSaved = await this.saveCompetition(
          data,
          entityManager,
        );
        await this.teamsService.saveTeamsAndPlayersFromLeague(
          competitionSaved,
          entityManager,
        );
        return competitionSaved;
      });
  }

  private async saveCompetition(data, entityManager) {
    const competition = Competition.buildCompetitionFromData(data);
    if (entityManager) {
      return entityManager.save(competition);
    }
    return this.competitionRepository.save(competition);
  }

  findOne(code: string) {
    return `This action returns a #${code} league`;
  }
}
