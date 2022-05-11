export class RandomProvider {
  getRandomBoolean(): boolean {
    return Math.random() >= 0.5;
  }

  getRandomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomItem(list: Array<any>) {
    return list[this.getRandomRange(0, list.length - 1)];
  }
}
