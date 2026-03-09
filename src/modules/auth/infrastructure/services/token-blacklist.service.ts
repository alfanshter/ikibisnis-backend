import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * Menyimpan JWT yang sudah logout ke in-memory cache.
 * Key: `blacklist:<jti>` — Value: '1'
 * TTL: sisa waktu token valid (sehingga otomatis hilang saat token expired).
 */
@Injectable()
export class TokenBlacklistService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  /**
   * Masukkan token ke blacklist.
   * @param jti  — unique identifier token (format: `<sub>:<iat>`)
   * @param ttlMs — sisa waktu token sebelum expired, dalam milidetik
   */
  async blacklist(jti: string, ttlMs: number): Promise<void> {
    // Minimal 1 detik agar tidak langsung hilang
    const ttlSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
    await this.cache.set(`blacklist:${jti}`, '1', ttlSeconds);
  }

  /**
   * Cek apakah token sudah diblacklist (sudah logout).
   */
  async isBlacklisted(jti: string): Promise<boolean> {
    const val = await this.cache.get(`blacklist:${jti}`);
    return val === '1';
  }
}
