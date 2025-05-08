import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import JwtConfig from '../config/jwt.config';
import { UsersService } from '../../users/providers/users.service';
import { RefreshTokenDto } from '../dtos/refresh-token-dto';
import { GetUserData } from '../interfaces/get-user-data.inteface';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class RefreshTokenProvider {
  private readonly logger = new Logger('RefreshTokenProvider');
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
    /**
     * Inject User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    /**
     * Import Generate Token Provider
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  public async generateRefreshToken(refreshTokenDto: RefreshTokenDto) {
    const { sub } = await this.jwtService.verifyAsync<Pick<GetUserData, 'sub'>>(
      refreshTokenDto.refreshToken,
      {
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
      },
    );

    const user = await this.userService.findUserByIdentifier(sub);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return await this.generateTokenProvider.generateTokens(user);
  }
}
