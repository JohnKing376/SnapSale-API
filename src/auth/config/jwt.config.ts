import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTTl: Number(process.env.JWT_ACCESS_TOKEN_TTL),
  refreshTokenTTL: Number(process.env.JWT_REFRESH_TOKEN_TTL),
}));
