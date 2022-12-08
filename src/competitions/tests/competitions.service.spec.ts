import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionsService } from '@competitions/services/competitions.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { getCompetitionByCode } from '@competitions/tests/competition-test.helper';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { API_FOOTBALL_V4, TRUNCATE_TABLE } from '@config/constants';
import {
  ENTITIES_TO_MAP,
  getEntityManager,
} from '@commons/testCommons/commons-helper';
import { EntityManager } from 'typeorm';
import { CompetitionsModule } from '@competitions/competitions.module';
import { TestTypeOrmModules } from '@database/test-database-helper';
import { Team } from '@teams/models/entities/team.entity';
import { getTeamsByLeagueCode } from '@teams/tests/teams-test.helper';
import { TeamsModule } from '@teams/teams.module';

describe('CompetitionsService', () => {
  let service: CompetitionsService;
  let configService: ConfigService;
  let moduleRef: TestingModule;
  let entityManager: EntityManager;
  let mockAxios;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TestTypeOrmModules(...ENTITIES_TO_MAP),
        ConfigModule.forRoot(envConfigParam),
        CompetitionsModule,
        TeamsModule,
      ],
    }).compile();
    service = moduleRef.get<CompetitionsService>(CompetitionsService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  beforeEach(async function () {
    mockAxios = new MockAdapter(axios);
    entityManager = getEntityManager(moduleRef);
    await entityManager.query(TRUNCATE_TABLE.PLAYERS);
    await entityManager.query(TRUNCATE_TABLE.TEAMS);
    await entityManager.query(TRUNCATE_TABLE.COMPETITIONS);
  });

  afterEach(async () => {
    mockAxios.reset();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('create', function () {
    const code = 'WC';
    beforeEach(async function () {
      mockAxios
        .onGet(`${configService.get(API_FOOTBALL_V4.URL)}/competitions/${code}`)
        .reply(200, getCompetitionByCode('WC'));
      mockAxios
        .onGet(
          `${configService.get(
            API_FOOTBALL_V4.URL,
          )}/competitions/${code}/teams`,
        )
        .reply(200, getTeamsByLeagueCode('WC'));
    });
    it('when we ask for a competition first time it should be persisted with teams and players', async () => {
      const competition = await service.create(code);
      expect(competition.code).toBe(code);
      expect(competition.id).toBeDefined();
      expect(competition.createdAt).toBeDefined();
      expect(competition.updatedAt).toBeDefined();
      const teams = await entityManager.count<Team>(Team, {
        where: { competition: { id: competition.id } },
      });
      expect(teams).toBe(32);
    });
  });
});
