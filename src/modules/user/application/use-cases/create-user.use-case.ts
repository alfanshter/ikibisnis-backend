import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Validate confirm password
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password dan konfirmasi password tidak cocok.');
    }

    // Check email uniqueness
    const emailExists = await this.userRepository.existsByEmail(dto.email);
    if (emailExists) {
      throw new ConflictException(`Email "${dto.email}" sudah digunakan.`);
    }

    // Check NIK uniqueness (if provided)
    if (dto.nik) {
      const nikExists = await this.userRepository.existsByNik(dto.nik);
      if (nikExists) {
        throw new ConflictException(`NIK "${dto.nik}" sudah terdaftar.`);
      }
    }

    // Check NPWP uniqueness (if provided)
    if (dto.npwp) {
      const npwpExists = await this.userRepository.existsByNpwp(dto.npwp);
      if (npwpExists) {
        throw new ConflictException(`NPWP "${dto.npwp}" sudah terdaftar.`);
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const now = new Date();

    const user = new User({
      id: randomUUID(),
      fullName: dto.fullName.trim(),
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      phone: dto.phone.trim(),
      address: dto.address.trim(),
      gender: dto.gender,
      roleId: dto.roleId,
      birthPlace: dto.birthPlace?.trim() ?? null,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      nik: dto.nik ?? null,
      npwp: dto.npwp ?? null,
      isActive: true,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.userRepository.save(user);
    return UserResponseDto.fromDomain(saved);
  }
}
