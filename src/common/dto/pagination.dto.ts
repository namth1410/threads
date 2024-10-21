import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1; // Không dùng `?`, vì giá trị mặc định sẽ được set.

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10; // Tương tự, không dùng `?` để đảm bảo luôn có giá trị.

  @IsOptional()
  @IsString()
  sortBy?: string; // Các trường tùy chọn có thể giữ nguyên `?`.

  @IsOptional()
  @IsString()
  order: 'ASC' | 'DESC' = 'ASC'; // Giá trị mặc định là 'ASC'.

  @IsOptional()
  filters?: Record<string, any>; // Bộ lọc không bắt buộc.
}
