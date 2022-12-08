import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '@players/models/entities/player.entity';
import { PlayersResolver } from '@players/resolvers/players.resolver';
import { PlayersService } from '@players/services/players.service';
import { PlayerRepository } from '@players/repositories/player.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayersResolver, PlayersService, PlayerRepository],
  exports: [PlayersService],
})
export class PlayersModule {}
