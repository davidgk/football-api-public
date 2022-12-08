import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeOrmModules } from '@database/test-database-helper';
import {
  ENTITIES_TO_MAP,
  getEntityManager,
} from '@commons/testCommons/commons-helper';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { TeamsModule } from '@teams/teams.module';
import { TeamsService } from '@teams/services/teams.service';
import { EntityManager } from 'typeorm';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { API_FOOTBALL_V4, TRUNCATE_TABLE } from '@config/constants';
import { createCompetitionMock } from '@competitions/tests/competition-test.helper';
import {
  createTeamMock,
  getTeam,
  getTeamsByLeagueCode,
} from '@teams/tests/teams-test.helper';
import { Team } from '@teams/models/entities/team.entity';
import { Player } from '@players/models/entities/player.entity';
import { createPlayerMock, getPlayer } from '@players/tests/player-test.helper';
import { HttpException } from '@nestjs/common';

describe('TeamsService', () => {
  let service: TeamsService;
  let configService: ConfigService;
  let moduleRef: TestingModule;
  let entityManager: EntityManager;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TestTypeOrmModules(...ENTITIES_TO_MAP),
        ConfigModule.forRoot(envConfigParam),
        TeamsModule,
      ],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);
    service = moduleRef.get<TeamsService>(TeamsService);
    entityManager = getEntityManager(moduleRef);
  });

  beforeEach(async function () {
    await Promise.all([
      entityManager.query(TRUNCATE_TABLE.PLAYERS),
      entityManager.query(TRUNCATE_TABLE.TEAMS),
      entityManager.query(TRUNCATE_TABLE.COMPETITIONS),
    ]);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('findTeamByName', function () {
    it('should fail when team not exist', async function () {
      await expect(service.findTeamByName('UH')).rejects.toThrow(HttpException);
    });
    describe('when team exists', function () {
      let team;
      beforeEach(async function () {
        const comp = await createCompetitionMock('WC', entityManager);
        team = await createTeamMock(getTeam(), comp, entityManager);
      });
      describe('and team contain players', function () {
        let playersIds;
        beforeEach(async function () {
          playersIds = [
            await createPlayerMock(getPlayer(), team, entityManager, false),
            await createPlayerMock(getPlayer(), team, entityManager, false),
          ].map((player) => player.id);
        });
        it('should return team with players', async function () {
          const teamFind = await service.findTeamByName(team.name);
          expect(teamFind.id).toBe(team.id);
          expect(teamFind.players.length).toBe(2);
          expect(teamFind.coaches.length).toBe(0);
          expect(playersIds.includes(teamFind.players[0].id)).toBeTruthy();
          expect(playersIds.includes(teamFind.players[1].id)).toBeTruthy();
        });
      });
      describe('and team contain as player the coach', function () {
        let coach;
        beforeEach(async function () {
          coach = await createPlayerMock(
            getPlayer(),
            team,
            entityManager,
            true,
          );
        });
        it('should return team adding coaches the player', async function () {
          const teamFind = await service.findTeamByName(team.name);
          expect(teamFind.id).toBe(team.id);
          expect(teamFind.players.length).toBe(1);
          expect(teamFind.coaches.length).toBe(1);
          expect(teamFind.players[0].id).toBe(coach.id);
          expect(teamFind.coaches[0].id).toBe(coach.id);
        });
      });
    });
  });

  describe('saveTeamsAndPlayersFromLeague', function () {
    const code = 'WC';
    let competition;
    let mockAxios;
    const responseSuccessTeams = getTeamsByLeagueCode('WC');
    beforeEach(async function () {
      competition = await createCompetitionMock('WC', entityManager);
      mockAxios = new MockAdapter(axios);
      mockAxios
        .onGet(
          `${configService.get(
            API_FOOTBALL_V4.URL,
          )}/competitions/${code}/teams`,
        )
        .reply(200, responseSuccessTeams);
    });
    afterEach(async () => {
      mockAxios.reset();
    });
    it('when we ask for a competition it should be persisted with teams and players and coachs', async () => {
      await service.saveTeamsAndPlayersFromLeague(competition, entityManager);
      const teams = await entityManager.find<Team>(Team, {
        where: { competition: { id: competition.id } },
      });
      expect(teams.length).toBe(32);
      for (const team of teams) {
        const playersCount = await entityManager.count<Player>(Player, {
          where: { team: { id: team.id }, isCoach: false },
        });
        expect(playersCount).toBeGreaterThan(0);
        const coachesCount = await entityManager.count<Player>(Player, {
          where: { team: { id: team.id }, isCoach: true },
        });
        expect(coachesCount).toBe(1);
      }
    });
  });
});
