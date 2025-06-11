export class ResponseDto<T> {
  data: T;
  message?: string;
  statusCode?: number;

  constructor(data: T, message?: string, statusCode: number = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
