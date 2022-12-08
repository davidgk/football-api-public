import { Args, Query, Resolver } from '@nestjs/graphql';
import { PlayersService } from '@players/services/players.service';
import { Player } from '@players/models/entities/player.entity';
import { FindPlayerParamsInput } from '@players/models/dto/find-player-params.input';
import { CoachInterface } from '@players/models/interfaces/player.interfaces';

@Resolver(() => Player)
export class PlayersResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Query(() => [Player], { name: 'players' })
  getTeamPlayers(
    @Args({ name: 'criteria', type: () => FindPlayerParamsInput })
    criteria: FindPlayerParamsInput,
  ): Promise<Player[]> {
    const code = criteria.leagueCode.trim();
    const teamName = criteria.teamName?.trim();
    return this.playersService.findPlayersByLeagueCodeAndTeam(code, teamName);
  }

  @Query(() => [Player], { name: 'coaches' })
  getCoaches(
    @Args({ name: 'criteria', type: () => FindPlayerParamsInput })
    criteria: FindPlayerParamsInput,
  ): Promise<CoachInterface[]> {
    const code = criteria.leagueCode.trim();
    const teamName = criteria.teamName?.trim();
    return this.playersService.findCoachesByLeagueCodeAndTeam(code, teamName);
  }
}
