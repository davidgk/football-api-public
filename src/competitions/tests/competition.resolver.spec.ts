import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeOrmModules } from '@database/test-database-helper';
import { CompetitionsResolver } from '@competitions/resolvers/competitions.resolver';
import { ENTITIES_TO_MAP } from '@commons/testCommons/commons-helper';
import { ConfigModule } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { FootballApiModule } from '@football-api/football-api.module';
import { CompetitionsModule } from '@competitions/competitions.module';

describe('CompetitionResolver', () => {
  let resolver: CompetitionsResolver;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TestTypeOrmModules(...ENTITIES_TO_MAP),
        ConfigModule.forRoot(envConfigParam),
        FootballApiModule,
        CompetitionsModule,
      ],
    }).compile();

    resolver = moduleRef.get<CompetitionsResolver>(CompetitionsResolver);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
