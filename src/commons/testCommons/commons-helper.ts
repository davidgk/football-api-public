import * as faker from 'community-faker';
import { TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { Competition } from '@competitions/models/entities/competition.entity';
import { Team } from '@teams/models/entities/team.entity';
import { Player } from '@players/models/entities/player.entity';

export function getRandomEmail(): string {
  return faker.internet.email();
}

export function getRandomUuid() {
  return faker.datatype.uuid();
}

export const ENTITIES_TO_MAP = [Competition, Team, Player];

export function getEntityManager(moduleRef: TestingModule): EntityManager {
  return moduleRef.get(getEntityManagerToken('default'));
}
