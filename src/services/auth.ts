import { api, storage } from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { ApiResponse } from '@/types/api';
import { StorageResponse } from '@/types/storage';
import { User } from '@/types/user';
import { isEmail } from '@/utils';
import { isAxiosError } from 'axios';

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

type ChangePasswordCredentials = {
  old_password: string;
  new_password: string;
}

type AuthResponse = {
  user: User,
};

type UploadFileResponse = {
  filename: string;
  content_type: string;
  size: number;
  url: string;
}

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
  updateAvatar: async (file: File) => {
    await api.post('storage', {
      type: 'avatars',
      context: 'upload',
    });

    const form = new FormData();
    form.append('file', file);

    try {
      const { data: response } = await storage.post<StorageResponse<UploadFileResponse>>('avatars', form);
      await authService.update({ avatar_url: response.data.url });
    } catch (error) {
      if (!isAxiosError(error) || error.config?.baseURL === import.meta.env.VITE_STORAGE_SERVER_URL) {
        throw new Error('Error uploading image');
      }

      throw error;
    }

  },
  changePassword: async (credentials: ChangePasswordCredentials) => {
    await api.post('auth/change-password', credentials);
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
