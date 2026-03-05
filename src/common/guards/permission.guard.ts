import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRoleRepository } from '../../modules/role/domain/repositories/role.repository.interface';
import { JwtPayload } from '../../modules/auth/infrastructure/strategies/jwt.strategy';
import {
  PERMISSION_KEY,
  RequiredPermission,
} from '../decorators/require-permission.decorator';

/**
 * PermissionGuard — dijalankan SETELAH JwtAuthGuard.
 *
 * Alur:
 * 1. Baca metadata @RequirePermission dari endpoint
 * 2. Ambil payload JWT (sudah di-attach oleh JwtAuthGuard via request.user)
 * 3. Load role dari database berdasarkan roleId di JWT
 * 4. Cek apakah role aktif dan memiliki feature+action yang diminta
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Ambil metadata permission dari endpoint
    const required = this.reflector.getAllAndOverride<
      RequiredPermission | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    // Tidak ada @RequirePermission → endpoint bebas (hanya butuh JWT)
    if (!required) {
      return true;
    }

    // 2. Ambil user dari request (di-set oleh JwtAuthGuard)
    const request = context.switchToHttp().getRequest<{
      user?: JwtPayload;
    }>();
    const user = request.user;

    if (!user?.roleId) {
      throw new UnauthorizedException('Token tidak valid.');
    }

    // 3. Load role dari database
    const role = await this.roleRepository.findById(user.roleId);

    if (!role) {
      throw new ForbiddenException(
        'Role tidak ditemukan. Hubungi administrator.',
      );
    }

    // 4. Cek apakah role aktif
    if (!role.isActive) {
      throw new ForbiddenException(
        'Role Anda saat ini tidak aktif. Hubungi administrator.',
      );
    }

    // 5. Cek permission: cari feature yang sesuai
    const permission = role.permissions.find(
      (p) => p.feature === required.feature,
    );

    if (!permission) {
      throw new ForbiddenException(
        `Akses ditolak. Role "${role.name}" tidak memiliki akses ke fitur "${required.feature}".`,
      );
    }

    // 6. Cek action yang dibutuhkan
    if (!permission.hasAction(required.action)) {
      throw new ForbiddenException(
        `Akses ditolak. Role "${role.name}" tidak memiliki izin "${required.action}" pada fitur "${required.feature}".`,
      );
    }

    return true;
  }
}
