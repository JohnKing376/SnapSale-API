import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import JwtConfig from '../config/jwt.config';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import User from '../../users/entities/user.entity';
import { GetUserData } from '../interfaces/get-user-data.inteface';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    /**
     * Import Jwt Service
     */
    private readonly jwtService: JwtService,
    /**
     * Import Jwt Config
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
  ) {}
  public async signIn<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.accessTokenTTl,
        secret: this.jwtConfiguration.secret,
      },
    );
  }

  public async generateTokens(
    user: User,
  ): Promise<{ accessTokens: string; refreshTokens: string }> {
    const accessTokens = await this.signIn<Partial<GetUserData>>(
      user.id,
      this.jwtConfiguration.accessTokenTTl,
      {
        email: user.email,
      },
    );
    const refreshTokens = await this.signIn<Pick<GetUserData, 'sub'>>(
      user.id,
      this.jwtConfiguration.refreshTokenTTL,
    );

    return {
      accessTokens,
      refreshTokens,
    };
  }
}
