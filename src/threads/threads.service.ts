// threads.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MediaEntity } from 'src/minio/media.entity';
import { MinioService } from 'src/minio/minio.service';
import { DataSource, Repository } from 'typeorm';
import { ThreadEntity } from './thread.entity'; // Giả sử bạn đã có một entity cho Thread
import { ThreadsRepository } from './threads.repository';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ThreadsService {
  constructor(
    // @InjectRepository(ThreadEntity)
    private threadsRepository: ThreadsRepository,

    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,

    private readonly minioService: MinioService, // Inject MinioService

    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<ResponseDto<ThreadEntity[]>> {
    const threadsWithPagination =
      await this.threadsRepository.getEntitiesWithPagination(paginationDto);

    const paginationMeta: PaginationMetaDto = {
      count: threadsWithPagination.count,
      totalPages: threadsWithPagination.totalPages,
      currentPage: threadsWithPagination.currentPage,
    };

    const response: ResponseDto<ThreadEntity[]> = {
      data: threadsWithPagination.data,
      pagination: paginationMeta,
      message: 'Threads retrieved successfully',
      statusCode: 200,
    };

    return response;
  }

  async create(threadData: Partial<ThreadEntity>): Promise<ThreadEntity> {
    return this.threadsRepository.createEntity(threadData);
  }

  async update(
    id: number,
    threadData: Partial<ThreadEntity>,
  ): Promise<ThreadEntity | null> {
    return this.threadsRepository.updateEntity(id, threadData);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // Truy vấn tất cả media liên quan đến thread
      const thread = await manager.findOne(ThreadEntity, {
        where: { id },
        relations: ['media', 'user'],
      });

      if (!thread) {
        throw new NotFoundException(`Thread with id ${id} not found`);
      }

      // Kiểm tra xem người dùng có phải là chủ sở hữu thread không
      if (thread.user.id !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this thread',
        );
      }

      // Xóa từng file khỏi MinIO
      const bucketName = process.env.MINIO_BUCKET_NAME;
      for (const media of thread.media) {
        await this.minioService.removeFile(bucketName, media.fileName);

        // Xóa bản ghi media
        await manager.delete(MediaEntity, media.id); // Sử dụng manager để xóa
      }

      // Sau khi xóa hết file trên MinIO và media, xóa thread trong database
      await manager.delete(ThreadEntity, id); // Sử dụng manager để xóa
    });
  }

  async addMediaToThread(
    threadId: number,
    url: string,
    type: string,
    fileName: string,
  ) {
    const media = this.mediaRepository.create({
      url,
      type,
      fileName,
      thread: { id: threadId },
    });
    await this.mediaRepository.save(media);
  }
}
