import { authService } from '@/services/auth';
import { ApiErrorResponse } from '@/types/api';
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

    if (error.status === 401 && !['/signin', '/signup'].includes(location.pathname)) {
      await authService.signout();
      notifier.error('Session expired', 'Your current session has expired. Sign in again.');
      return Promise.reject(error);
    }

    const response = error.response!.data;
    const message = response.errors ? response.errors[0] : response.message;

    notifier.error(response.error, message);
    return Promise.reject(error);
  },
);
