import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { RandomProvider } from 'src/shared/providers/RandomProvider/random.provider';

@Injectable()
export class GameService {
  constructor(private readonly randomProvider: RandomProvider) {}

  private readonly words = fs
    .readFileSync('src/assets/br-sem-acentos.txt', { encoding: 'utf8' })
    .split('\n');

  private removeAccents(str: string): string {
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  private getRandomLetter(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const index = this.randomProvider.getRandomRange(0, letters.length - 1);
    return letters[index];
  }

  checkWordExists(word: string): boolean {
    word = this.removeAccents(word);

    return this.words.includes(word);
  }

  getRandomSyllable(): string {
    let syllable = '';

    for (let i = 0; i < this.randomProvider.getRandomRange(2, 3); i++) {
      syllable += this.getRandomLetter();
    }

    if (this.checkWordExists(syllable)) {
      return syllable;
    } else {
      return this.getRandomSyllable();
    }
  }
}
