// threads.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import guard
import { ThreadEntity } from './thread.entity'; // Entity cho bài đăng
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateThreadDto } from './dto/update-thread.dto';

@ApiTags('threads')
@Controller('threads')
@UseGuards(JwtAuthGuard) // Áp dụng guard cho toàn bộ controller
@ApiBearerAuth() // Áp dụng Bearer Auth cho toàn bộ controller
export class ThreadsController {
  constructor(
    private readonly threadsService: ThreadsService,
    private readonly usersService: UsersService, // Inject UsersService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all threads' })
  @ApiResponse({
    status: 200,
    description: 'List of threads.',
    type: [ThreadEntity],
  })
  async findAll(): Promise<ThreadEntity[]> {
    return this.threadsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new thread' })
  @ApiResponse({
    status: 201,
    description: 'Thread created successfully.',
    type: ThreadEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(
    @Body() createThreadDto: CreateThreadDto, // Use DTO here
  ): Promise<ThreadEntity> {
    // Fetch the user entity by ID
    const user = await this.usersService.findById(createThreadDto.userId); // Adjust according to your service

    if (!user) {
      throw new NotFoundException('User not found'); // Handle user not found scenario
    }

    const threadData: Partial<ThreadEntity> = {
      content: createThreadDto.content,
      user: user, // Assign the actual user entity
    };

    return this.threadsService.create(threadData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing thread' })
  @ApiResponse({
    status: 200,
    description: 'Thread updated successfully.',
    type: ThreadEntity,
  })
  @ApiResponse({ status: 404, description: 'Thread not found' })
  async update(
    @Param('id') id: number,
    @Body() updateThreadDto: UpdateThreadDto, // Sử dụng DTO ở đây
  ): Promise<ThreadEntity> {
    // Chuyển đổi từ DTO sang Partial<ThreadEntity> trước khi gọi service
    const threadData: Partial<ThreadEntity> = {
      content: updateThreadDto.content,
    };
    return this.threadsService.update(id, threadData);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a thread' })
  @ApiResponse({ status: 204, description: 'Thread deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Thread not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.threadsService.remove(id);
  }
}
