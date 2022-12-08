import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Competition } from '@competitions/models/entities/competition.entity';
import { FootballApiService } from '@football-api/services/football-api.service';
import { TeamsRepository } from '@teams/repositories/teams-repository.service';
import {
  SaveSQuadParamsInterface,
  TeamExpectedInterface,
} from '@teams/models/interfaces/TeamInterfaces';
import { Team } from '@teams/models/entities/team.entity';
import { PlayersService } from '@players/services/players.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class TeamsService {
  constructor(
    private teamRepository: TeamsRepository,
    private footballApiService: FootballApiService,
    private playerService: PlayersService,
  ) {}

  async saveTeamsAndPlayersFromLeague(
    competition: Competition,
    entityManager: EntityManager,
  ): Promise<void> {
    try {
      const response = await this.footballApiService.getTeamsByCompetitionCode(
        competition.code,
      );
      await this.saveTeamsAndSquadFromTeamApiData(
        response,
        competition,
        entityManager,
      );
    } catch (e) {
      throw new HttpException(
        'Something fail on saving teams and Players:' + e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async saveTeamsAndSquadFromTeamApiData(
    response: { data: { teams: TeamExpectedInterface[] } },
    competition: Competition,
    entityManager: EntityManager,
  ) {
    const data = response?.data;
    if (!data || (data.teams || []).length === 0)
      throw new Error('Cannot process a competition without teams');
    const teams = response.data.teams;
    const saveSquadParams = await this.saveTeamsAndCreatePlayerParams(
      teams,
      competition,
      entityManager,
    );
    await this.saveSquadAndCoaches(saveSquadParams, entityManager);
  }

  private async saveSquadAndCoaches(
    saveSquadParams: SaveSQuadParamsInterface[],
    entityManager: EntityManager,
  ) {
    const promiseSquadSaving = [];
    for (const squadParams of saveSquadParams) {
      promiseSquadSaving.push(
        this.playerService.saveSquadAndCoachFromTeam(
          squadParams,
          entityManager,
        ),
      );
    }
    await Promise.all(promiseSquadSaving);
  }

  private async saveTeamsAndCreatePlayerParams(
    teams: TeamExpectedInterface[],
    competition: Competition,
    entityManager: EntityManager,
  ) {
    const saveSquadParams: SaveSQuadParamsInterface[] = [];
    for (const team of teams) {
      const teamSaved = await this.teamRepository.save(
        Team.createTeamFromData(team, competition),
        entityManager,
      );
      saveSquadParams.push({
        team: teamSaved,
        squad: team.squad,
        coach: team.coach,
      });
    }
    return saveSquadParams;
  }

  async findTeamByName(name: string): Promise<Team> {
    try {
      const team = await this.teamRepository.findByName(name);
      team.coaches = [];
      if (team.players.length === 1) {
        const player = team.players[0];
        team.coaches = player.isCoach ? [player] : [];
      }
      return team;
    } catch (e) {
      throw new HttpException(
        `Something fail on finding teams with name${name}: ${e.message}`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
