// threads.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThreadEntity } from './thread.entity'; // Giả sử bạn đã có một entity cho Thread

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(ThreadEntity)
    private threadsRepository: Repository<ThreadEntity>,
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
    await this.threadsRepository.delete(id);
  }
}
