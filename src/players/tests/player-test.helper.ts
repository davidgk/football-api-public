import { Team } from '@teams/models/entities/team.entity';
import { Player } from '@players/models/entities/player.entity';
import { PlayerRepository } from '@players/repositories/player.repository';
import { EntityManager } from 'typeorm';
import { createCompetitionMock } from '@competitions/tests/competition-test.helper';
import { createTeamMock } from '@teams/tests/teams-test.helper';
import { PlayerInterface } from '@players/models/interfaces/player.interfaces';

export async function createPlayers(
  repository: PlayerRepository,
  aTeamSaved,
  anotherTeamSaved,
) {
  return await Promise.all([
    repository.buildAndSave(
      {
        name: 'name01',
        dateOfBirth: new Date(),
        nationality: 'Argentine',
      },
      aTeamSaved,
    ),
    repository.buildAndSave(
      {
        name: 'name02',
        dateOfBirth: new Date(),
        nationality: 'Argentine',
      },
      aTeamSaved,
    ),
    repository.buildAndSave(
      { name: 'name03', dateOfBirth: new Date(), nationality: 'Uruguay' },
      anotherTeamSaved,
    ),
  ]);
}

export async function createAnotherCompetitionLeague(
  entityManager: EntityManager,
  anotherTeam: any,
) {
  const otherCompetition = await createCompetitionMock('PL', entityManager);
  const otherTeamSaved = await createTeamMock(
    anotherTeam,
    otherCompetition,
    entityManager,
  );
  await createPlayerMock(getPlayer(), otherTeamSaved, entityManager);
}

export const createPlayerMock = async (
  playerJson: any,
  team: Team,
  entityManager,
  isCoach = false,
) => {
  const playerToSave = new Player();
  playerToSave.name = playerJson.name;
  playerToSave.isCoach = isCoach;
  playerToSave.dateOfBirth = playerJson.dateOfBirth;
  playerToSave.nationality = playerJson.nationality;
  playerToSave.team = team;
  if (isCoach) {
    return entityManager.save(playerToSave);
  }
  playerToSave.position = (playerJson as PlayerInterface).position;
  return entityManager.save(playerToSave);
};

export function getPlayer() {
  return {
    id: 44,
    name: 'Cristiano Ronaldo',
    firstName: 'Cristiano Ronaldo',
    lastName: 'dos Santos Aveiro',
    dateOfBirth: '1985-02-05',
    nationality: 'Portugal',
    position: 'Centre-Forward',
    shirtNumber: 7,
    lastUpdated: '2021-10-13T08:04:10Z',
    currentTeam: {
      area: {
        id: 2072,
        name: 'England',
        code: 'ENG',
        flag: 'https://crests.football-data.org/770.svg',
      },
      id: 66,
      name: 'Manchester United FC',
      shortName: 'Man United',
      tla: 'MUN',
      crest: 'https://crests.football-data.org/66.png',
      address: 'Sir Matt Busby Way Manchester M16 0RA',
      website: 'http://www.manutd.com',
      founded: 1878,
      clubColors: 'Red / White',
      venue: 'Old Trafford',
      runningCompetitions: [
        {
          id: 2021,
          name: 'Premier League',
          code: 'PL',
          type: 'LEAGUE',
          emblem: 'https://crests.football-data.org/PL.png',
        },
        {
          id: 2001,
          name: 'UEFA Champions League',
          code: 'CL',
          type: 'CUP',
          emblem: 'https://crests.football-data.org/CL.png',
        },
        {
          id: 2055,
          name: 'FA Cup',
          code: 'FAC',
          type: 'CUP',
          emblem: 'https://crests.football-data.org/FA_CUP.png',
        },
      ],
      contract: {
        start: '2021-08',
        until: '2023-06',
      },
    },
  };
}
