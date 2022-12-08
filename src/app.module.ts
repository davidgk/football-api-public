import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { ConfigModule } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from '@database/database-config.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { graphqlParams } from '@config/graphql-params';
import { CompetitionsModule } from '@competitions/competitions.module';
import { TeamsModule } from '@teams/teams.module';
import { PlayersModule } from '@players/players.module';
import { FootballApiModule } from '@football-api/football-api.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigParam),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlParams),
    TeamsModule,
    PlayersModule,
    CompetitionsModule,
    FootballApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
