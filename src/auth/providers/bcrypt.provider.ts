import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async comparePassword(
    data: string | Buffer,
    encryptedData: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, encryptedData);
  }

  public async hashPassword(data: string | Buffer): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(data, salt);
  }
}
