import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UpdateUserDto, ChangePasswordDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User dengan id "${id}" tidak ditemukan.`);
    }

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userRepository.existsByEmail(
        dto.email,
        id,
      );
      if (emailExists) {
        throw new ConflictException(`Email "${dto.email}" sudah digunakan.`);
      }
      user.email = dto.email.toLowerCase().trim();
    }

    if (dto.nik && dto.nik !== user.nik) {
      const nikExists = await this.userRepository.existsByNik(dto.nik, id);
      if (nikExists) {
        throw new ConflictException(`NIK "${dto.nik}" sudah terdaftar.`);
      }
      user.nik = dto.nik;
    }

    if (dto.npwp && dto.npwp !== user.npwp) {
      const npwpExists = await this.userRepository.existsByNpwp(dto.npwp, id);
      if (npwpExists) {
        throw new ConflictException(`NPWP "${dto.npwp}" sudah terdaftar.`);
      }
      user.npwp = dto.npwp;
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName.trim();
    if (dto.roleId !== undefined) user.roleId = dto.roleId;
    if (dto.phone !== undefined) user.phone = dto.phone.trim();
    if (dto.address !== undefined) user.address = dto.address.trim();
    if (dto.gender !== undefined) user.gender = dto.gender;
    if (dto.birthPlace !== undefined) user.birthPlace = dto.birthPlace.trim();
    if (dto.birthDate !== undefined) user.birthDate = new Date(dto.birthDate);
    if (dto.isActive !== undefined) {
      dto.isActive ? user.activate() : user.deactivate();
    }

    user.updatedAt = new Date();
    const updated = await this.userRepository.update(user);
    return UserResponseDto.fromDomain(updated);
  }
}

@Injectable()
export class ChangePasswordUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User dengan id "${id}" tidak ditemukan.`);
    }

    if (!dto.newPassword || !dto.confirmPassword) {
      throw new BadRequestException(
        'Password baru dan konfirmasi password wajib diisi.',
      );
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'Password baru dan konfirmasi password tidak cocok.',
      );
    }

    // Verify current password if provided
    if (dto.currentPassword) {
      const isMatch = await bcrypt.compare(
        dto.currentPassword,
        user.passwordHash,
      );
      if (!isMatch) {
        throw new BadRequestException('Password saat ini tidak sesuai.');
      }
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    user.updatedAt = new Date();
    await this.userRepository.update(user);

    return { message: 'Password berhasil diperbarui.' };
  }
}
