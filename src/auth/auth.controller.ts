// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserEntity) // Inject UserRepository thay vì sử dụng UsersService
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Mô tả ngắn cho endpoint
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseDto<UserEntity>> {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (user) {
      return this.authService.login(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;
    const session = await this.authService.validateRefreshToken(refresh_token);
    if (!session) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({
      where: { id: session.userId },
    });

    return this.authService.login(user); // Tạo accessToken mới
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard) // Bảo vệ route logout bằng JWT guard
  @ApiBearerAuth() // Thêm Bearer Auth vào route
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  async logout(@Request() req) {
    // Thường bạn sẽ lấy userId từ token
    const userId = req.user.id; // giả sử req.user được xác thực trước đó
    return this.authService.logout(userId);
  }
}
