import { Logger } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  @WebSocketServer() server: Server;
  private userList: { id: string; name: string }[] = [];
  private logger: Logger = new Logger('GameGateway');

  @SubscribeMessage('ChangeGuess')
  handleInputChangeGuess(
    client: any,
    payload: {
      guess: string;
      id: string;
    },
  ) {
    this.logger.log(`handleInputChangeGuess: ${payload.id}: ${payload.guess}`);
    this.server.emit('setPlayerWord', payload);
  }

  afterInit() {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.userList = this.userList.filter((user) => user.id !== client.id);
    this.server.emit('updateUsers', this.userList);
  }

  @SubscribeMessage('NewUser')
  handleNewUser(client: Socket, args: any) {
    const pl: { id: string; name: string } = args;
    this.logger.log(`Client connected: ${pl.id}`);
    this.userList.push(pl);
    this.server.emit('updateUsers', this.userList);
  }

  @SubscribeMessage('SubmitGuess')
  handleSubmitGuess(
    client: Socket,
    payload: { guess: string; id: string; syllable: string },
  ) {
    this.logger.log(`handleSubmitGuess: ${payload.id}: ${payload.guess}`);

    const exists = this.gameService.checkWordExists(payload.guess);

    const inSyllable = payload.guess
      .toLowerCase()
      .includes(payload.syllable.toLowerCase());

    const emitObj = {
      id: payload.id,
      guess: payload.guess,
      exists: inSyllable && exists,
    };

    this.server.emit('checkWord', emitObj);

    if (inSyllable && exists) {
      const syllable = this.gameService.getRandomSyllable();
      const newRoundObj = {
        syllable: syllable,
      };
      this.server.emit('newRound', newRoundObj);
    }
  }
}
