import { Module } from '@nestjs/common';
import { RandomProvider } from 'src/shared/providers/RandomProvider/random.provider';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RandomProvider, GameGateway, GameService],
})
export class GameModule {}
