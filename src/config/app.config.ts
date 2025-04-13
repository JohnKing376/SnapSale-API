import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV || 'production',
}));
