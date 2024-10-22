import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: 'Username of the user' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  username: string;

  @ApiProperty({ example: 'testpassword', description: 'Password of the user' })
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
