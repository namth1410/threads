// threads.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DataSource, Repository } from 'typeorm';
import { ThreadEntity } from './thread.entity'; // Giả sử bạn đã có một entity cho Thread
import { MediaEntity } from 'src/minio/media.entity';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(ThreadEntity)
    private threadsRepository: Repository<ThreadEntity>,

    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,

    private readonly minioService: MinioService, // Inject MinioService

    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<ThreadEntity[]> {
    return this.threadsRepository.find();
  }

  async create(threadData: Partial<ThreadEntity>): Promise<ThreadEntity> {
    const thread = this.threadsRepository.create(threadData);
    return this.threadsRepository.save(thread);
  }

  async update(
    id: number,
    threadData: Partial<ThreadEntity>,
  ): Promise<ThreadEntity> {
    await this.threadsRepository.update(id, threadData);
    return this.threadsRepository.findOne({ where: { id } }); // Sử dụng where để tìm kiếm theo ID
  }

  async remove(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // Truy vấn tất cả media liên quan đến thread
      const thread = await manager.findOne(ThreadEntity, {
        where: { id },
        relations: ['media'],
      });

      if (!thread) {
        throw new NotFoundException(`Thread with id ${id} not found`);
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
