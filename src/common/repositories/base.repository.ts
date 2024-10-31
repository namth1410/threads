import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { paginate } from '../helpers/pagination.helper';
import { ResponseDto } from '../dto/response.dto';
import { PaginationMetaDto } from '../dto/pagination-meta.dto';

interface BaseEntity {
  id: number;
}

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async getAllEntity(options?: FindManyOptions<T>): Promise<ResponseDto<T[]>> {
    const [result, total] = await this.repository.findAndCount(options);

    const pagination = options?.take
      ? {
          count: result.length,
          totalPages: Math.ceil(total / options.take),
          currentPage: options.skip ? options.skip / options.take + 1 : 1,
        }
      : undefined;

    return new ResponseDto<T[]>(
      result,
      pagination
        ? new PaginationMetaDto(
            pagination.count,
            pagination.totalPages,
            pagination.currentPage,
          )
        : undefined,
      'Data retrieved successfully',
      200,
    );
  }

  async getEntityById(id: number): Promise<T | null> {
    const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    return this.repository.findOne({ where });
  }

  // Thêm phương thức tìm theo username
  async findByUsername(username: string): Promise<T | null> {
    const where: FindOptionsWhere<T> = {
      username,
    } as unknown as FindOptionsWhere<T>;
    return this.repository.findOne({ where });
  }

  async createEntity(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async updateEntity(id: number, data: DeepPartial<T>): Promise<T | null> {
    // Kiểm tra xem bản ghi có tồn tại không
    const existingEntity = await this.getEntityById(id);

    if (!existingEntity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    // Cập nhật dữ liệu
    this.repository.merge(existingEntity, data); // Merge dữ liệu mới vào bản ghi đã tồn tại

    // Lưu bản ghi đã cập nhật
    await this.repository.save(existingEntity);

    return existingEntity;
  }

  async deleteEntity(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
