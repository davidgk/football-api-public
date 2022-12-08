import { Module } from '@nestjs/common';
import { TeamsResolver } from '@teams/resolvers/teams.resolver';
import { TeamsService } from '@teams/services/teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '@teams/models/entities/team.entity';
import { TeamsRepository } from '@teams/repositories/teams-repository.service';
import { FootballApiModule } from '@football-api/football-api.module';
import { PlayersModule } from '@players/players.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), FootballApiModule, PlayersModule],
  providers: [TeamsResolver, TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
