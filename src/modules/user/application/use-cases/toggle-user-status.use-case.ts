import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class ToggleUserStatusUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User dengan id "${id}" tidak ditemukan.`);
    }
    if (user.isActive) {
      user.deactivate();
    } else {
      user.activate();
    }
    const updated = await this.userRepository.update(user);
    return UserResponseDto.fromDomain(updated);
  }
}
