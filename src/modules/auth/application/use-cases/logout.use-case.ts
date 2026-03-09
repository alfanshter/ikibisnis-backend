import { Injectable } from '@nestjs/common';
import { TokenBlacklistService } from '../../infrastructure/services/token-blacklist.service';
import type { JwtPayload } from '../../infrastructure/strategies/jwt.strategy';

export interface LogoutResponseDto {
  message: string;
}

@Injectable()
export class LogoutUseCase {
  constructor(private readonly tokenBlacklist: TokenBlacklistService) {}

  async execute(payload: JwtPayload): Promise<LogoutResponseDto> {
    // JTI = kombinasi unik sub + iat untuk identifikasi token ini
    const jti = `${payload.sub}:${payload.iat ?? 0}`;

    // Hitung sisa TTL: exp (epoch seconds) dikurangi waktu sekarang
    const nowSeconds = Math.floor(Date.now() / 1000);
    const remainingMs = payload.exp
      ? Math.max(0, payload.exp - nowSeconds) * 1000
      : 24 * 60 * 60 * 1000; // fallback 1 hari

    await this.tokenBlacklist.blacklist(jti, remainingMs);

    return { message: 'Logout berhasil. Token telah dicabut.' };
  }
}
