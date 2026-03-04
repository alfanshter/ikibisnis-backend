import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { LoginDto } from '../dtos/login.dto';
import { AuthUserDto, LoginResponseDto } from '../dtos/login-response.dto';

interface JwtDecoded {
  sub: string;
  email: string;
  roleId: string;
  roleName: string | null;
  iat?: number;
  exp?: number;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(
      dto.email.toLowerCase().trim(),
    );
    if (!user) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Akun Anda telah dinonaktifkan. Hubungi administrator.',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    user.recordLogin();
    await this.userRepository.update(user);

    const payload: JwtDecoded = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.roleName,
    };

    const accessToken = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode<JwtDecoded>(accessToken);
    const expiresIn =
      decoded?.exp && decoded?.iat ? decoded.exp - decoded.iat : 3600;

    const userDto = new AuthUserDto();
    userDto.id = user.id;
    userDto.fullName = user.fullName;
    userDto.email = user.email;
    userDto.roleId = user.roleId;
    userDto.roleName = user.roleName;
    userDto.gender = user.gender;
    userDto.isActive = user.isActive;
    userDto.lastLoginAt = user.lastLoginAt;

    const response = new LoginResponseDto();
    response.accessToken = accessToken;
    response.expiresIn = expiresIn;
    response.user = userDto;

    return response;
  }
}
