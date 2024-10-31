export class PaginationMetaDto {
  count: number; // Tổng số bản ghi trong trang hiện tại
  totalPages: number; // Tổng số trang
  currentPage: number; // Trang hiện tại

  constructor(count: number, totalPages: number, currentPage: number) {
    this.count = count;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
  }
}
