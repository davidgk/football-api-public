import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class FindPlayerParamsInput {
  @Field(() => String)
  @IsNotEmpty()
  leagueCode: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  teamName: string;
}
