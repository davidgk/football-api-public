import { Test, TestingModule } from '@nestjs/testing';
import { TeamsResolver } from '@teams/resolvers/teams.resolver';
import { TestTypeOrmModules } from '@database/test-database-helper';
import { ENTITIES_TO_MAP } from '@commons/testCommons/commons-helper';
import { ConfigModule } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { TeamsModule } from '@teams/teams.module';

describe('TeamsResolver', () => {
  let resolver: TeamsResolver;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TestTypeOrmModules(...ENTITIES_TO_MAP),
        ConfigModule.forRoot(envConfigParam),
        TeamsModule,
      ],
    }).compile();

    resolver = moduleRef.get<TeamsResolver>(TeamsResolver);
  });

  afterAll(async () => {
    await moduleRef.close();
  });
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
