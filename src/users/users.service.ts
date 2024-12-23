import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PageResponseDto } from 'src/common/dto/page-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(
    paginationDto: PaginationDto,
  ): Promise<PageResponseDto<UserEntity>> {
    // Gọi phương thức getAllEntity từ UsersRepository và truyền vào paginationDto
    return this.usersRepository.getAllEntity({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: paginationDto.sortBy
        ? { [paginationDto.sortBy]: paginationDto.order }
        : undefined,
      where: paginationDto.filters,
    });
  }

  async getUserById(id: number): Promise<ResponseDto<UserEntity> | null> {
    return this.usersRepository.getEntityById(id); // Sử dụng phương thức từ UsersRepository
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.usersRepository.findByUsername(username);
  }

  async createUser(
    data: Partial<UserEntity>,
  ): Promise<ResponseDto<UserEntity>> {
    const existingUser = await this.usersRepository.findByUsername(
      data.username,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists'); // Ném lỗi nếu username đã tồn tại
    }
    return this.usersRepository.createEntity(data); // Sử dụng phương thức từ UsersRepository
  }

  async updateUser(
    id: number,
    data: Partial<UserEntity>,
  ): Promise<ResponseDto<UserEntity>> {
    // Kiểm tra xem displayId có tồn tại không
    if (data.displayId) {
      const existingUser = await this.usersRepository.getEntityByCriteria({
        displayId: data.displayId,
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error('Display ID must be unique');
      }
    }

    return this.usersRepository.updateEntity(id, data);
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.deleteEntity(id); // Sử dụng phương thức từ UsersRepository
  }
}
