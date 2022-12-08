import { Module } from '@nestjs/common';
import { FootballApiService } from './services/football-api.service';
import { CheckAccessFreemiumLib } from '@football-api/lib/check-access-freemium.lib';

@Module({
  providers: [FootballApiService, CheckAccessFreemiumLib],
  exports: [FootballApiService],
})
export class FootballApiModule {}
