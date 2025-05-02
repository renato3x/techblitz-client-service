import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { ApiErrorResponse, ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { isEmail } from '@/utils';
import { notifier } from '@/utils/notifier';
import { AxiosError, AxiosResponse } from 'axios';

type LoginCredentials = {
  usernameOrEmail: string;
  password: string;
}

type RegisterCredentials = {
  name: string;
  username: string;
  email: string;
  password: string;
}

type AuthResponse = {
  user: User,
};

export const authService = {
  register: async (credentials: RegisterCredentials) => {
    try {
      const { data: response } = await api.post<ApiResponse<AuthResponse>>('auth/register', credentials);
      useAuthStore.setState({
        isSignedIn: true,
        user: response.data.user,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const { data: response } = error.response as AxiosResponse<ApiErrorResponse>;

        if (response.errors) {
          notifier.open('Error', response.errors[0]);
        }

        notifier.open('Error!', response.message);
        return;
      }

      notifier.open('Oops!', 'Something went wrong. Try again later.');
    }
  },
  login: async ({ password, usernameOrEmail }: LoginCredentials) => {
    const body = {
      ...(isEmail(usernameOrEmail) ? { email: usernameOrEmail } : { username: usernameOrEmail }),
      password: password,
    };

    try {
      const { data: response } = await api.post<ApiResponse<AuthResponse>>('auth/login', body);
      useAuthStore.setState({
        isSignedIn: true,
        user: response.data.user,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const { data: response } = error.response as AxiosResponse<ApiErrorResponse>;

        notifier.open('Error!', response.message);
        return;
      }

      notifier.open('Oops!', 'Something went wrong. Try again later.');
    }
  },
  logout: async () => {
    await api.post('auth/logout');
    useAuthStore.setState({
      isSignedIn: false,
      user: null,
    });
  },
  validate: async () => {
    try {
      const { data: response } = await api.get<ApiResponse<User>>('auth/user');
      useAuthStore.setState({
        isSignedIn: true,
        user: response.data,
      });
    } catch {
      useAuthStore.setState({
        isSignedIn: false,
        user: null,
      });
    }
  },
};
