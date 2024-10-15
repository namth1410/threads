import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity'; // Đảm bảo rằng bạn đã nhập đúng

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // Nếu bạn đang sử dụng TypeORM
  ],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
