import { Test, TestingModule } from '@nestjs/testing';
import { PlayersResolver } from '@players/resolvers/players.resolver';
import { TestTypeOrmModules } from '@database/test-database-helper';
import { ENTITIES_TO_MAP } from '@commons/testCommons/commons-helper';
import { ConfigModule } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { PlayersModule } from '@players/players.module';

describe('PlayersResolver', () => {
  let resolver: PlayersResolver;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TestTypeOrmModules(...ENTITIES_TO_MAP),
        ConfigModule.forRoot(envConfigParam),
        PlayersModule,
      ],
    }).compile();

    resolver = moduleRef.get<PlayersResolver>(PlayersResolver);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
