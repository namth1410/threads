import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { paginate } from '../helpers/pagination.helper';

interface BaseEntity {
  id: number;
}

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async getAllEntity(): Promise<T[]> {
    return this.repository.find();
  }

  async getEntityById(id: number): Promise<T | null> {
    const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    return this.repository.findOne({ where });
  }

  // Phương thức mới để lấy danh sách với phân trang
  async getEntitiesWithPagination(paginationDto: PaginationDto): Promise<any> {
    const queryBuilder: SelectQueryBuilder<T> =
      this.repository.createQueryBuilder('entity'); // Tạo query builder cho thực thể

    // Sử dụng hàm paginate để áp dụng phân trang
    return paginate(queryBuilder, paginationDto);
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
