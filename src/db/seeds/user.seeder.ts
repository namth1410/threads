// src/db/seeds/user.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "users" CASCADE;');

    const repository = dataSource.getRepository(UserEntity);
    // Mã hóa mật khẩu
    const superAdminPassword = await bcrypt.hash('superadmin', 10); // 10 là số lượng vòng lặp salt

    // Thêm người dùng
    await repository.insert([
      {
        username: 'superadmin',
        password: superAdminPassword,
        email: 'superadmin@example.com', // Thêm email nếu có
        role: Role.SUPERADMIN, // Thêm vai trò nếu cần
      },
      {
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10),
        email: 'user1@example.com',
        role: Role.USER, // Thêm vai trò nếu cần
      },
      {
        username: 'username',
        password: await bcrypt.hash('password', 10),
        email: 'user2@example.com',
        role: Role.USER, // Thêm vai trò nếu cần
      },
    ]);
  }
}