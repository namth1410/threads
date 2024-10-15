import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateThreadDto {
  @ApiProperty({
    example: 'This is a sample thread content',
    description: 'Content of the thread',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500) // Giới hạn chiều dài của nội dung bài đăng
  content: string;

  @ApiProperty({ example: 1, description: 'User ID of the thread creator' })
  @IsNotEmpty()
  userId: number; // ID của người dùng tạo bài đăng (nếu cần)
}
