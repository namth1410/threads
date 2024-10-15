import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>, // inject User repository
  ) {}

  // Tạo người dùng mới và lưu vào database
  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.usersRepository.create(user); // tạo đối tượng User
    return this.usersRepository.save(newUser); // lưu vào cơ sở dữ liệu
  }

  // Tìm người dùng dựa trên tên đăng nhập
  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id } }); // Tìm người dùng theo ID
  }
}
