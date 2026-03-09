import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { TokenBlacklistService } from '../services/token-blacklist.service';

export interface JwtPayload {
  sub: string;
  email: string;
  roleId: string;
  roleName: string | null;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenBlacklist: TokenBlacklistService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtSecret') ?? 'changeme',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Token tidak valid atau akun tidak aktif.',
      );
    }

    // Cek apakah token sudah di-logout (masuk blacklist)
    const jti = `${payload.sub}:${payload.iat ?? 0}`;
    const blacklisted = await this.tokenBlacklist.isBlacklisted(jti);
    if (blacklisted) {
      throw new UnauthorizedException(
        'Sesi telah berakhir. Silakan login kembali.',
      );
    }

    return payload;
  }
}
