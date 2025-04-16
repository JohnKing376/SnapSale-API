import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(data: string): Promise<string>;

  abstract comparePassword(
    data: string,
    encryptedData: string,
  ): Promise<boolean>;
}
