import type { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  code?: number;
  data?: unknown;
}

export type ApiError = AxiosError<ApiErrorResponse>;

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  code?: number;
  data?: T;
}

export type ApiMethod<T> = (payload: T) => Promise<ApiResponse>;
