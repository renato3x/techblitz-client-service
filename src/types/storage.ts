export type StorageResponse<T> = {
  data: T;
  timestamp: Date;
  status_code: number;
}
