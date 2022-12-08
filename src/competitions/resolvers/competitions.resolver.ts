import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CompetitionsService } from '@competitions/services/competitions.service';
import { Competition } from '@competitions/models/entities/competition.entity';

@Resolver(() => Competition)
export class CompetitionsResolver {
  private readonly competitionsService: CompetitionsService;

  constructor(competitionsService: CompetitionsService) {
    this.competitionsService = competitionsService;
  }

  @Mutation(() => Competition)
  importLeague(@Args('leagueCode') leagueCode: string) {
    return this.competitionsService.create(leagueCode);
  }
}
