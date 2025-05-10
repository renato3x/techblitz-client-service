import { authService } from '@/services/auth';
import { ApiErrorResponse } from '@/types/api';
import { FREE_AUTH_PATHS } from '@/utils';
import { notifier } from '@/utils/notifier';
import axios, { isAxiosError } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_MAIN_SERVER_URL,
  withCredentials: true,
});

export const storage = axios.create({
  baseURL: import.meta.env.VITE_STORAGE_SERVER_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!isAxiosError<ApiErrorResponse>(error)) {
      notifier.defaultError();
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (FREE_AUTH_PATHS.includes(location.pathname)) {
        return Promise.reject(error);
      }

      await authService.signout();
      notifier.error('Session expired', 'Your current session has expired. Sign in again.');
      return Promise.reject(error);
    }

    const response = error.response?.data;
    const message = response?.errors?.[0] || response?.message || 'Unexpected error';

    notifier.error(response?.error || 'Error', message);
    return Promise.reject(error);
  },
);
