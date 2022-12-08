import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeOrmModules } from '@database/test-database-helper';
import {
  ENTITIES_TO_MAP,
  getEntityManager,
} from '@commons/testCommons/commons-helper';
import { ConfigModule } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { EntityManager } from 'typeorm';
import { PLAYER_ERRORS, TRUNCATE_TABLE } from '@config/constants';
import {
  createTeamMock,
  getTeamsByLeagueCode,
} from '@teams/tests/teams-test.helper';
import { PlayersService } from '@players/services/players.service';
import { Player } from '@players/models/entities/player.entity';
import { createCompetitionMock } from '@competitions/tests/competition-test.helper';
import { PlayersModule } from '@players/players.module';
import { PlayerRepository } from '@players/repositories/player.repository';
import {
  createAnotherCompetitionLeague,
  createPlayerMock,
  createPlayers,
  getPlayer,
} from '@players/tests/player-test.helper';
import { CoachInterface } from '@players/models/interfaces/player.interfaces';

describe('Player Service', () => {
  let service: PlayersService;
  let repository: PlayerRepository;
  let moduleRef: TestingModule;
  let entityManager: EntityManager;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TestTypeOrmModules(...ENTITIES_TO_MAP),
        ConfigModule.forRoot(envConfigParam),
        PlayersModule,
      ],
    }).compile();
    service = moduleRef.get<PlayersService>(PlayersService);
    repository = moduleRef.get<PlayerRepository>(PlayerRepository);
  });

  beforeEach(async function () {
    entityManager = getEntityManager(moduleRef);
    await entityManager.query(TRUNCATE_TABLE.PLAYERS);
    await entityManager.query(TRUNCATE_TABLE.TEAMS);
    await entityManager.query(TRUNCATE_TABLE.COMPETITIONS);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('saveSquadFromTeam', function () {
    let aTeam;
    let competition;
    let aTeamSaved;
    const responseSuccessTeams = getTeamsByLeagueCode('WC');
    beforeEach(async function () {
      aTeam = responseSuccessTeams.teams[0];
      competition = await createCompetitionMock('WC', entityManager);
      aTeamSaved = await createTeamMock(aTeam, competition, entityManager);
    });
    it('should save all players when they exists within team', async () => {
      await service.saveSquadAndCoachFromTeam(
        {
          team: aTeamSaved,
          squad: aTeam.squad,
          coach: aTeam.coach,
        },
        entityManager,
      );
      const playersCount = await entityManager.count<Player>(Player, {
        where: { team: { id: aTeamSaved.id }, isCoach: false },
      });
      expect(playersCount).toBe(26);
    });
    it('should save the coach ', async () => {
      await service.saveSquadAndCoachFromTeam(
        {
          team: aTeamSaved,
          squad: [],
          coach: aTeam.coach,
        },
        entityManager,
      );
      const players = await entityManager.find<Player>(Player, {
        where: { team: { id: aTeamSaved.id }, isCoach: true },
      });
      expect(players.length).toBe(1);
    });
  });

  describe('find Players And coaches By LeagueCode And Team', function () {
    let competition;
    let aTeamSaved;
    let anotherTeamSaved;
    let player01;
    let player02;
    let player03;
    const responseSuccessTeams = getTeamsByLeagueCode('WC');
    describe('fail scenarios', function () {
      it('should fail when competition not exists searching players', async () => {
        await expect(
          service.findPlayersByLeagueCodeAndTeam('NC'),
        ).rejects.toThrow(
          'Something fail on finding players: ' +
            PLAYER_ERRORS.COMPETITION_NULL,
        );
      });
      it('should fail when competition not exists searching coaches', async () => {
        await expect(
          service.findCoachesByLeagueCodeAndTeam('NC'),
        ).rejects.toThrow(
          'Something fail on finding coaches: ' +
            PLAYER_ERRORS.COMPETITION_NULL,
        );
      });
    });

    describe('when competition exists', function () {
      beforeEach(async function () {
        competition = await createCompetitionMock('WC', entityManager);
        const aTeam = responseSuccessTeams.teams[0];
        aTeamSaved = await createTeamMock(aTeam, competition, entityManager);
        aTeam.name = 'Argentina';
        const anotherTeam = responseSuccessTeams.teams[1];
        anotherTeamSaved = await createTeamMock(
          anotherTeam,
          competition,
          entityManager,
        );

        [player01, player02, player03] = await createPlayers(
          repository,
          aTeamSaved,
          anotherTeamSaved,
        );

        await createAnotherCompetitionLeague(
          entityManager,
          responseSuccessTeams.teams[2],
        );
      });
      describe('and we are looking for players', function () {
        it('should find only players which belong to that competition not sending team as param', async function () {
          const players = await service.findPlayersByLeagueCodeAndTeam(
            competition.code,
          );
          expect(players.length).toBe(3);
          const idPlayers = players.map((pl) => pl.id);
          expect(idPlayers.includes(player01.id)).toBeTruthy();
          expect(idPlayers.includes(player02.id)).toBeTruthy();
          expect(idPlayers.includes(player03.id)).toBeTruthy();
        });
        it('should find only players which belong to that team and competition if is team as param', async function () {
          const players = await service.findPlayersByLeagueCodeAndTeam(
            competition.code,
            aTeamSaved.name,
          );
          expect(players.length).toBe(2);
          const idPlayers = players.map((pl) => pl.id);
          expect(idPlayers.includes(player01.id)).toBeTruthy();
          expect(idPlayers.includes(player02.id)).toBeTruthy();
        });
      });
      describe('and we are looking for coaches', function () {
        let coach_01: CoachInterface;
        let coach_02: CoachInterface;
        beforeEach(async function () {
          [coach_01, coach_02] = await Promise.all([
            createPlayerMock(getPlayer(), aTeamSaved, entityManager, true),
            createPlayerMock(
              getPlayer(),
              anotherTeamSaved,
              entityManager,
              true,
            ),
          ]);
        });
        it('should find coaches which belong to that competition not sending team as param', async function () {
          const coaches = await service.findCoachesByLeagueCodeAndTeam(
            competition.code,
          );
          expect(coaches.length).toBe(2);
          const idCoaches = coaches.map((pl) => pl.id);
          expect(idCoaches.includes(coach_01.id)).toBeTruthy();
          expect(idCoaches.includes(coach_02.id)).toBeTruthy();
        });
        it('should find only coaches which belong to that team and competition if is team as param', async function () {
          const coaches = await service.findCoachesByLeagueCodeAndTeam(
            competition.code,
            aTeamSaved.name,
          );
          expect(coaches.length).toBe(1);
          const idCoaches = coaches.map((pl) => pl.id);
          expect(idCoaches.includes(coach_01.id)).toBeTruthy();
        });
      });
    });
  });
});
