import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { isEmail } from '@/utils';

type LoginCredentials = {
  usernameOrEmail: string;
  password: string;
}

type LoginResponse = {
  user: User,
};

export const authService = {
  login: async ({ password, usernameOrEmail }: LoginCredentials) => {
    const body = {
      ...(isEmail(usernameOrEmail) ? { email: usernameOrEmail } : { username: usernameOrEmail }),
      password: password,
    };

    const { data: response } = await api.post<ApiResponse<LoginResponse>>('auth/login', body);
    useAuthStore.setState({
      isSignedIn: true,
      user: response.data.user,
    });
  },
  validate: async () => {
    try {
      const { data: response } = await api.get<ApiResponse<User>>('auth/user');
      useAuthStore.setState({
        isSignedIn: true,
        user: response.data,
      });
    } catch (_) {
      useAuthStore.setState({
        isSignedIn: false,
        user: null,
      });
    }
  },
};
