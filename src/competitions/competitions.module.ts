import { Module } from '@nestjs/common';
import { CompetitionsService } from '@competitions/services/competitions.service';
import { CompetitionsRepository } from '@competitions/repositories/competitions.repository';
import { Competition } from '@competitions/models/entities/competition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootballApiModule } from '@football-api/football-api.module';
import { CompetitionsResolver } from '@competitions/resolvers/competitions.resolver';
import { TeamsModule } from '@teams/teams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competition]),
    FootballApiModule,
    TeamsModule,
  ],
  providers: [
    CompetitionsRepository,
    CompetitionsService,
    CompetitionsResolver,
  ],
  exports: [CompetitionsRepository],
})
export class CompetitionsModule {}
