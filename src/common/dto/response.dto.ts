import { PaginationMetaDto } from './pagination-meta.dto';

export class ResponseDto<T> {
  data: T;
  pagination?: PaginationMetaDto; // Thông tin phân trang, nếu có
  message?: string; // Thông báo
  statusCode?: number; // Mã trạng thái HTTP

  constructor(
    data: T,
    pagination?: PaginationMetaDto,
    message?: string,
    statusCode: number = 200,
  ) {
    this.data = data;
    this.pagination = pagination;
    this.message = message;
    this.statusCode = statusCode;
  }
}
