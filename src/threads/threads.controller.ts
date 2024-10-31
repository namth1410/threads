// threads.controller.ts
import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Redis } from 'ioredis';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MinioService } from 'src/minio/minio.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import guard
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadEntity } from './thread.entity'; // Entity cho bài đăng
import { ThreadsService } from './threads.service';

@ApiTags('threads')
@Controller('threads')
@UseGuards(JwtAuthGuard) // Áp dụng guard cho toàn bộ controller
@ApiBearerAuth() // Áp dụng Bearer Auth cho toàn bộ controller
export class ThreadsController {
  constructor(
    private readonly threadsService: ThreadsService,
    private readonly usersService: UsersService, // Inject UsersService
    private readonly minioService: MinioService,
    // @InjectRedis() private readonly redisClient: Redis,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all threads' })
  @ApiResponse({
    status: 200,
    description: 'List of threads.',
    type: [ThreadEntity],
  })
  @Roles(Role.SUPERADMIN, Role.USER)
  @UseGuards(RolesGuard)
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseDto<ThreadEntity[]>> {
    // const cacheKey = `threads_page_${paginationDto.page}_limit_${paginationDto.limit}`;
    // const cachedThreads = await this.redisClient.get(cacheKey);

    // if (cachedThreads) {
    //   // Trả về dữ liệu từ cache (dạng chuỗi JSON, cần parse lại)
    //   return JSON.parse(cachedThreads);
    // }
    const threadsWithPagination =
      await this.threadsService.findAll(paginationDto);

    // Lưu kết quả vào Redis với TTL là 60 giây
    // await this.redisClient.set(
    //   cacheKey,
    //   JSON.stringify(threadsWithPagination),
    //   'EX',
    //   60,
    // );

    return threadsWithPagination;
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Create a new thread' })
  @ApiResponse({
    status: 201,
    description: 'Thread created successfully.',
    type: ThreadEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(
    @Body() createThreadDto: CreateThreadDto, // Use DTO here
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ThreadEntity> {
    // Fetch the user entity by ID
    const user = await this.usersService.getUserById(createThreadDto.userId); // Adjust according to your service

    if (!user) {
      throw new NotFoundException('User not found'); // Handle user not found scenario
    }

    const threadData: Partial<ThreadEntity> = {
      content: createThreadDto.content,
      user: user, // Assign the actual user entity
    };

    const thread = await this.threadsService.create(threadData);
    // Xử lý tệp tải lên
    if (files && files.length > 0) {
      const bucketName = process.env.MINIO_BUCKET_NAME;
      for (const file of files) {
        const fileName = await this.minioService.uploadFile(bucketName, file); // Thay thế bucketName bằng tên bucket thực tế

        const fileUrl = await this.minioService.getFileUrl(
          bucketName,
          fileName,
        );

        const type = file.mimetype.startsWith('image') ? 'image' : 'video';

        // Lưu thông tin file vào cơ sở dữ liệu
        await this.threadsService.addMediaToThread(
          thread.id,
          fileUrl,
          type,
          fileName,
        );
      }
    }

    return thread;
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
  @UseGuards(RolesGuard) // Chỉ cần kiểm tra vai trò
  @Roles(Role.SUPERADMIN, Role.USER) // Chỉ định các vai trò hợp lệ
  async remove(@Param('id') id: number, @Request() req): Promise<void> {
    const userId = req.user.id;
    return this.threadsService.remove(id, userId);
  }
}
