import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SaveSQuadParamsInterface } from '@teams/models/interfaces/TeamInterfaces';
import { PlayerRepository } from '@players/repositories/player.repository';
import { EntityManager } from 'typeorm';
import { Player } from '@players/models/entities/player.entity';
import { CoachInterface } from '@players/models/interfaces/player.interfaces';

@Injectable()
export class PlayersService {
  constructor(private playerRepository: PlayerRepository) {}

  async saveSquadAndCoachFromTeam(
    squadParams: SaveSQuadParamsInterface,
    entityManager: EntityManager,
  ) {
    try {
      if (squadParams.squad.length > 0) {
        const playerPromises = [];
        this.buildSavingPlayerPromises(
          squadParams,
          playerPromises,
          entityManager,
        );
        await Promise.all(playerPromises);
      }
      await this.playerRepository.buildAndSave(
        squadParams.coach,
        squadParams.team,
        true,
        entityManager,
      );
    } catch (e) {
      throw new HttpException(
        'Something fail on saving players:' + e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private buildSavingPlayerPromises(
    squadParams: SaveSQuadParamsInterface,
    playerPromises: any[],
    entityManager: EntityManager,
  ) {
    for (const player of squadParams.squad) {
      playerPromises.push(
        this.playerRepository.buildAndSave(
          player,
          squadParams.team,
          false,
          entityManager,
        ),
      );
    }
  }

  async findPlayersByLeagueCodeAndTeam(
    code: string,
    teamName?: string,
  ): Promise<Player[]> {
    return await this.findPlayers(code, teamName, false);
  }

  private async findPlayers(
    code: string,
    teamName: string,
    shouldBeCoach = false,
  ) {
    try {
      const competition = await this.playerRepository.findCompetitionOrFail(
        code,
      );
      return this.playerRepository.findPlayersByLeagueCodeAndTeam(
        competition.code,
        teamName,
        shouldBeCoach,
      );
    } catch (e) {
      const title = `Something fail on finding ${
        shouldBeCoach ? 'coaches' : 'players'
      }:`;
      throw new HttpException(`${title} ${e.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  findCoachesByLeagueCodeAndTeam(
    code: string,
    teamName?: string,
  ): Promise<CoachInterface[]> {
    return this.findPlayers(code, teamName, true);
  }
}
