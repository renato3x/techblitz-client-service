export type ApiResponse<T> = {
  data: T;
  timestamp: Date;
  status_code: number;
}

export type ApiErrorResponse = {
  error: string;
  message: string;
  timestamp: Date,
  status_code: number;
  errors?: string[];
}
