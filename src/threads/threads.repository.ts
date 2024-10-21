import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from '../common/repositories/base.repository';
import { ThreadEntity } from './thread.entity';
import { UserEntity } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/helpers/pagination.helper';

@Injectable()
export class ThreadsRepository extends BaseRepository<ThreadEntity> {
  constructor(
    @InjectRepository(ThreadEntity)
    private readonly threadEntityRepository: Repository<ThreadEntity>,
  ) {
    super(threadEntityRepository);
  }
}
