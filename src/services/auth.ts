import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { isEmail } from '@/utils';

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

type UpdateCredentials = {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
}

type AuthResponse = {
  user: User,
};

export const authService = {
  signup: async (credentials: RegisterCredentials) => {
    const { data: response } = await api.post<ApiResponse<AuthResponse>>('auth/register', credentials);
    useAuthStore.setState({
      isSignedIn: true,
      user: response.data.user,
    });
  },
  signin: async ({ password, usernameOrEmail }: LoginCredentials) => {
    const body = {
      ...(isEmail(usernameOrEmail) ? { email: usernameOrEmail } : { username: usernameOrEmail }),
      password: password,
    };

    const { data: response } = await api.post<ApiResponse<AuthResponse>>('auth/login', body);
    useAuthStore.setState({
      isSignedIn: true,
      user: response.data.user,
    });
  },
  signout: async () => {
    await api.post('auth/logout');
    useAuthStore.setState({
      isSignedIn: false,
      user: null,
    });
  },
  update: async (credentials: UpdateCredentials) => {
    const { data: response } = await api.patch<ApiResponse<User>>('auth/user', credentials);
    useAuthStore.setState({ user: response.data });
  },
  validate: async () => {
    useAuthStore.setState({ isLoading: true });

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
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  },
};
