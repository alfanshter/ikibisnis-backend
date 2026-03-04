import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User dengan id "${id}" tidak ditemukan.`);
    }
    await this.userRepository.hardDelete(id);
    return { message: `User "${user.fullName}" berhasil dihapus.` };
  }
}
