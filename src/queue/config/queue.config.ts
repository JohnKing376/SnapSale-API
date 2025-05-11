import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  host: process.env.QUEUE_HOST,
  port: Number(process.env.QUEUE_PORT),
}));
