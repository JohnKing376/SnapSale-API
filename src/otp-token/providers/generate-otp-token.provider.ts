import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateOtpTokenProvider {
  //TODO: Refine Generate Token
  public generateToken(length: number): number {
    let i: number;
    const numbers: Array<number> = [];

    /**
     * To Prevent the Leading number from being zero
     */
    numbers.push(Math.floor(Math.random() * 9) + 1);

    for (i = 1; i < length; i++) {
      const randomNumbers = Math.floor(Math.random() * 10);
      numbers.push(randomNumbers);
    }

    return Number(numbers.join(''));
  }
}
