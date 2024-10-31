import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserEntity } from './user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard) // Áp dụng guard cho toàn bộ controller
@ApiBearerAuth() // Áp dụng Bearer Auth cho toàn bộ controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination info',
    type: ResponseDto,
  })
  @Roles(Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  async getAllUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseDto<UserEntity[]>> {
    return this.usersService.getAllUsers(paginationDto);
  }
}
