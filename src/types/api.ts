export type ApiResponse<T> = {
  data: T;
  timestamp: Date;
  status_code: number;
}
