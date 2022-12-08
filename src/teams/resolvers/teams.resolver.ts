import { Args, Query, Resolver } from '@nestjs/graphql';
import { TeamsService } from '@teams/services/teams.service';
import { Team } from '@teams/models/entities/team.entity';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => Team, { name: 'team' })
  findByName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Team> {
    return this.teamsService.findTeamByName(name);
  }
}
